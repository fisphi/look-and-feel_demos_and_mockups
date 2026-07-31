(async function initEdtfComponents() {
const { default: edtf, parse } = await import('https://cdn.jsdelivr.net/npm/edtf@4.11.0/+esm');

const LEVEL_ONE_DATE_TYPES = ['Date', 'Year', 'Decade', 'Century'];
const MONTHS = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];
const QUALIFIERS = {
    exact: { suffix: '', text: '' },
    approximate: { suffix: '~', text: 'ungefähr' },
    uncertain: { suffix: '?', text: 'unsicher' },
    both: { suffix: '%', text: 'ungefähr und unsicher' }
};
const QUALIFIER_SUFFIXES = new Set(Object.values(QUALIFIERS).map(item => item.suffix).filter(Boolean));

let componentCounter = 0;
const dateComponents = [];
const intervalComponents = [];

function validateWithEdtf(value, types) {
    try {
        const numericDate = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[?~%])?$/);
        if (numericDate) {
            const [, year, month, day] = numericDate;
            const candidate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            if (candidate.getUTCFullYear() !== Number(year)
                || candidate.getUTCMonth() !== Number(month) - 1
                || candidate.getUTCDate() !== Number(day)) {
                const error = new RangeError('Ungültiger Kalendertag');
                error.code = 'calendar';
                throw error;
            }
        }
        const parsed = parse(value, { level: 1, types });
        return { valid: true, parsed, date: edtf(parsed), canonical: edtf(parsed).edtf };
    } catch (error) {
        if (error.code === 'calendar') return { valid: false, error, errorType: 'calendar' };
        const supplemented = validateQualifiedUnspecified(value, types);
        return supplemented || { valid: false, error, errorType: 'syntax' };
    }
}

// EDTF.js 4.11.0 akzeptiert Level-1-X-Muster, aber nicht deren abschließende
// Qualifikatoren. Diese Ergänzung ist absichtlich auf die offiziell erlaubten,
// rechtsseitigen X-Muster und genau einen zentral definierten Qualifikator begrenzt.
function validateQualifiedUnspecified(value, types) {
    if (types.includes('Interval') && value.includes('/')) {
        const parts = value.split('/');
        if (parts.length !== 2) return null;
        const [lower, upper] = parts;
        const lowerResult = lower ? validateWithEdtf(lower, LEVEL_ONE_DATE_TYPES) : null;
        const upperResult = upper && upper !== '..' ? validateWithEdtf(upper, LEVEL_ONE_DATE_TYPES) : null;
        if ((lower && !lowerResult?.valid) || (upper && upper !== '..' && !upperResult?.valid)) return null;
        return {
            valid: true,
            canonical: value,
            supplemented: true,
            date: {
                edtf: value,
                min: lowerResult?.date?.min ?? -Infinity,
                max: upper === '..' ? Infinity : (upperResult?.date?.max ?? Infinity)
            }
        };
    }

    const match = value.match(/^(\d{3}X|\d{2}XX|\d{4}-XX|\d{4}-(?:0[1-9]|1[0-2])-XX)([?~%])$/);
    if (!match || !QUALIFIER_SUFFIXES.has(match[2])) return null;
    try {
        const parsed = parse(match[1], { level: 1, types });
        const base = edtf(parsed);
        return {
            valid: true,
            parsed,
            canonical: value,
            supplemented: true,
            date: { edtf: value, min: base.min, max: base.max }
        };
    } catch {
        return null;
    }
}

function splitQualifier(value) {
    const candidate = value.slice(-1);
    const suffix = QUALIFIER_SUFFIXES.has(candidate) ? candidate : '';
    return { base: suffix ? value.slice(0, -1) : value, suffix };
}

function stateFromValue(value) {
    const { base, suffix } = splitQualifier(value || '');
    const evaluation = Object.entries(QUALIFIERS)
        .find(([, item]) => item.suffix === suffix)?.[0] || 'exact';
    let match;

    if ((match = base.match(/^(\d{2})XX$/))) {
        return { precision: 'century', year: `${match[1]}00`, month: '', day: '', unknownMonth: false, unknownDay: false, evaluation };
    }
    if ((match = base.match(/^(\d{3})X$/))) {
        return { precision: 'decade', year: `${match[1]}0`, month: '', day: '', unknownMonth: false, unknownDay: false, evaluation };
    }
    if ((match = base.match(/^(\d{4})-XX$/))) {
        return { precision: 'month', year: match[1], month: '', day: '', unknownMonth: true, unknownDay: false, evaluation };
    }
    if ((match = base.match(/^(\d{4})-(\d{2})-XX$/))) {
        return { precision: 'date', year: match[1], month: match[2], day: '', unknownMonth: false, unknownDay: true, evaluation };
    }
    if ((match = base.match(/^(\d{4})-(\d{2})-(\d{2})$/))) {
        return { precision: 'date', year: match[1], month: match[2], day: match[3], unknownMonth: false, unknownDay: false, evaluation };
    }
    if ((match = base.match(/^(\d{4})-(\d{2})$/))) {
        return { precision: 'month', year: match[1], month: match[2], day: '', unknownMonth: false, unknownDay: false, evaluation };
    }
    if ((match = base.match(/^(\d{4})$/))) {
        return { precision: 'year', year: match[1], month: '', day: '', unknownMonth: false, unknownDay: false, evaluation };
    }
    return { precision: 'year', year: '', month: '', day: '', unknownMonth: false, unknownDay: false, evaluation: 'exact' };
}

function buildValue(state) {
    const year = String(state.year || '').padStart(4, '0');
    if (!/^\d{4}$/.test(year) || Number(year) < 1) return '';

    let value;
    switch (state.precision) {
        case 'century': value = `${year.slice(0, 2)}XX`; break;
        case 'decade': value = `${year.slice(0, 3)}X`; break;
        case 'month':
            value = state.unknownMonth ? `${year}-XX` : (state.month ? `${year}-${state.month}` : '');
            break;
        case 'date':
            if (state.unknownMonth) value = `${year}-XX`;
            else if (!state.month) value = '';
            else value = state.unknownDay ? `${year}-${state.month}-XX` : (state.day ? `${year}-${state.month}-${state.day}` : '');
            break;
        default: value = year;
    }
    return value ? `${value}${QUALIFIERS[state.evaluation].suffix}` : '';
}

function interpretation(value) {
    if (!value) return 'Keine Angabe';
    const { base, suffix } = splitQualifier(value);
    const qualifier = Object.values(QUALIFIERS).find(item => item.suffix === suffix)?.text;
    let text = value;
    let match;

    if ((match = base.match(/^(\d{2})XX$/))) text = `Unbekanntes Jahr zwischen ${match[1]}00 und ${match[1]}99`;
    else if ((match = base.match(/^(\d{3})X$/))) text = `Unbekanntes Jahr zwischen ${match[1]}0 und ${match[1]}9`;
    else if ((match = base.match(/^(\d{4})-XX$/))) text = `Unbekannter Monat im Jahr ${match[1]}`;
    else if ((match = base.match(/^(\d{4})-(\d{2})-XX$/))) text = `Unbekannter Tag im ${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
    else if ((match = base.match(/^(\d{4})-(\d{2})-(\d{2})$/))) text = `${Number(match[3])}. ${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
    else if ((match = base.match(/^(\d{4})-(\d{2})$/))) text = `${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
    else if (/^\d{4}$/.test(base)) text = `Jahr ${base}`;

    return qualifier ? `${text}; ${qualifier}` : text;
}

class EdtfDateInput {
    constructor(host, input, options = {}) {
        this.host = host;
        this.input = input;
        this.options = options;
        this.id = `edtf-${++componentCounter}`;
        this.state = stateFromValue(input.value);
        this.render();
        this.bind();
        this.update(false);
        dateComponents.push(this);
    }

    render() {
        const label = this.host.dataset.label || this.options.label || 'Datum';
        const monthOptions = MONTHS.map((month, index) =>
            `<option value="${String(index + 1).padStart(2, '0')}">${month}</option>`).join('');
        this.host.className = 'edtf-component border rounded p-3';
        this.host.innerHTML = `
            <fieldset>
                <legend class="fs-6 fw-semibold mb-3">${label} <span class="badge text-bg-secondary">EDTF Level 1</span></legend>
                <div class="row g-2 align-items-end">
                    <div class="col-sm-6 col-lg-3">
                        <label class="form-label" for="${this.id}-precision">Genauigkeit</label>
                        <select class="form-select" id="${this.id}-precision" data-part="precision">
                            <option value="date">Vollständiges Datum</option><option value="month">Monat</option>
                            <option value="year">Jahr</option><option value="decade">Jahrzehnt</option><option value="century">Jahrhundert</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label" for="${this.id}-year">Jahr</label>
                        <input class="form-control" id="${this.id}-year" data-part="year" type="number" min="1" max="9999" inputmode="numeric">
                    </div>
                    <div class="col-sm-6 col-lg-3" data-group="month">
                        <label class="form-label" for="${this.id}-month">Monat</label>
                        <select class="form-select" id="${this.id}-month" data-part="month"><option value="">Bitte wählen</option>${monthOptions}</select>
                    </div>
                    <div class="col-sm-6 col-lg-2" data-group="day">
                        <label class="form-label" for="${this.id}-day">Tag</label>
                        <input class="form-control" id="${this.id}-day" data-part="day" type="number" min="1" max="31" inputmode="numeric">
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label" for="${this.id}-evaluation">Bewertung</label>
                        <select class="form-select" id="${this.id}-evaluation" data-part="evaluation">
                            <option value="exact">Genau</option><option value="approximate">Ungefähr</option>
                            <option value="uncertain">Unsicher</option><option value="both">Ungefähr und unsicher</option>
                        </select>
                    </div>
                </div>
                <div class="d-flex flex-wrap gap-3 mt-2">
                    <div class="form-check" data-group="unknown-month"><input class="form-check-input" id="${this.id}-unknown-month" data-part="unknownMonth" type="checkbox"><label class="form-check-label" for="${this.id}-unknown-month">Monat unbekannt</label></div>
                    <div class="form-check" data-group="unknown-day"><input class="form-check-input" id="${this.id}-unknown-day" data-part="unknownDay" type="checkbox"><label class="form-check-label" for="${this.id}-unknown-day">Tag unbekannt</label></div>
                </div>
                <div class="row g-2 mt-1 ${this.options.hideSummary ? 'd-none' : ''}">
                    <div class="col-sm-4"><label class="form-label" for="${this.id}-output">EDTF-Wert</label><input id="${this.id}-output" class="form-control edtf-output" readonly aria-describedby="${this.id}-interpretation ${this.id}-error"></div>
                    <div class="col-sm-8"><div class="form-label">Interpretation</div><div id="${this.id}-interpretation" class="form-control-plaintext"></div></div>
                </div>
                <div id="${this.id}-error" class="invalid-feedback d-block" role="status" aria-live="polite"></div>
            </fieldset>`;
        this.controls = Object.fromEntries([...this.host.querySelectorAll('[data-part]')].map(control => [control.dataset.part, control]));
        this.output = this.host.querySelector('.edtf-output');
        this.interpretation = this.host.querySelector(`#${this.id}-interpretation`);
        this.error = this.host.querySelector(`#${this.id}-error`);
        Object.entries(this.state).forEach(([part, value]) => {
            if (!this.controls[part]) return;
            if (this.controls[part].type === 'checkbox') this.controls[part].checked = value;
            else this.controls[part].value = value;
        });
        Object.values(this.controls).forEach(control => {
            control.setAttribute('aria-describedby', `${this.id}-interpretation ${this.id}-error`);
        });
    }

    bind() {
        this.host.addEventListener('input', () => this.update());
        this.host.addEventListener('change', () => this.update());
    }

    update(dispatch = true) {
        Object.entries(this.controls).forEach(([part, control]) => {
            this.state[part] = control.type === 'checkbox' ? control.checked : control.value;
        });
        const showMonth = ['date', 'month'].includes(this.state.precision);
        const showDay = this.state.precision === 'date' && !this.state.unknownMonth;
        this.host.querySelectorAll('[data-group="month"], [data-group="unknown-month"]').forEach(el => el.classList.toggle('d-none', !showMonth));
        this.host.querySelectorAll('[data-group="day"], [data-group="unknown-day"]').forEach(el => el.classList.toggle('d-none', !showDay));
        this.controls.month.disabled = !showMonth || this.state.unknownMonth;
        this.controls.day.disabled = !showDay || this.state.unknownDay;
        this.controls.unknownDay.disabled = !showDay;

        const value = buildValue(this.state);
        const result = value ? validateWithEdtf(value, LEVEL_ONE_DATE_TYPES) : { valid: true, canonical: '' };
        this.valid = result.valid;
        this.input.value = result.valid ? result.canonical : value;
        if (this.output) this.output.value = this.input.value;
        if (this.interpretation) this.interpretation.textContent = interpretation(this.input.value);
        const errorMessage = result.valid ? '' : result.errorType === 'calendar'
            ? 'Dieses Datum existiert im Kalender nicht.'
            : 'Diese Kombination kann nicht als gültiger EDTF-Level-1-Wert dargestellt werden.';
        this.setError(errorMessage);
        if (dispatch) {
            this.input.dispatchEvent(new Event('input', { bubbles: true }));
            this.options.onChange?.(this);
        }
        return this.valid;
    }

    setError(message) {
        this.error.textContent = message;
        this.host.setAttribute('aria-invalid', message ? 'true' : 'false');
        Object.values(this.controls).forEach(control => control.setAttribute('aria-invalid', message ? 'true' : 'false'));
    }

    clear() {
        this.controls.year.value = '';
        this.controls.month.value = '';
        this.controls.day.value = '';
        this.controls.unknownMonth.checked = false;
        this.controls.unknownDay.checked = false;
        this.update();
    }

    range() {
        return this.input.value && this.valid ? validateWithEdtf(this.input.value, LEVEL_ONE_DATE_TYPES).date : null;
    }
}

class EdtfIntervalInput {
    constructor(host, input) {
        this.host = host;
        this.input = input;
        this.id = `edtf-interval-${++componentCounter}`;
        const [start = '', end = ''] = (input.value || '').split('/');
        this.endMode = end === '..' ? 'ongoing' : end === '' && input.value.includes('/') ? 'unknown' : 'known';
        this.render(start, this.endMode === 'known' ? end : '');
        intervalComponents.push(this);
    }

    render(start, end) {
        this.host.className = 'edtf-interval border rounded p-3';
        this.host.innerHTML = `
            <fieldset><legend class="fs-6 fw-semibold">Tätigkeitszeitraum</legend>
                <div class="row g-3"><div class="col-12" data-start-host data-label="Beginn"></div>
                <div class="col-12"><label class="form-label" for="${this.id}-end-mode">Ende</label>
                    <select id="${this.id}-end-mode" class="form-select" data-end-mode><option value="known">Bekanntes Datum</option><option value="unknown">Unbekannt</option><option value="ongoing">Weiterhin andauernd</option></select></div>
                <div class="col-12" data-end-host data-label="Ende"></div></div>
                <div class="row g-2 mt-2"><div class="col-sm-4"><label class="form-label" for="${this.id}-output">EDTF-Zeitraum</label><input id="${this.id}-output" class="form-control edtf-output" readonly aria-describedby="${this.id}-text ${this.id}-error"></div>
                <div class="col-sm-8"><div class="form-label">Interpretation</div><div id="${this.id}-text" class="form-control-plaintext"></div></div></div>
                <div id="${this.id}-error" class="invalid-feedback d-block" role="status" aria-live="polite"></div>
            </fieldset>`;
        const startInput = document.createElement('input'); startInput.type = 'hidden'; startInput.value = start;
        const endInput = document.createElement('input'); endInput.type = 'hidden'; endInput.value = end;
        this.start = new EdtfDateInput(this.host.querySelector('[data-start-host]'), startInput, { label: 'Beginn', hideSummary: true, onChange: () => this.update() });
        this.end = new EdtfDateInput(this.host.querySelector('[data-end-host]'), endInput, { label: 'Ende', hideSummary: true, onChange: () => this.update() });
        this.mode = this.host.querySelector('[data-end-mode]');
        this.mode.value = this.endMode;
        this.output = this.host.querySelector('.edtf-output');
        this.text = this.host.querySelector(`#${this.id}-text`);
        this.error = this.host.querySelector(`#${this.id}-error`);
        this.mode.addEventListener('change', () => this.update());
        this.update();
    }

    update() {
        const start = this.start.input.value;
        const mode = this.mode.value;
        const end = mode === 'ongoing' ? '..' : mode === 'unknown' ? '' : this.end.input.value;
        this.end.host.classList.toggle('d-none', mode !== 'known');
        let value = start || end ? `${start}/${end}` : '';
        let error = '';
        if (mode === 'known' && !end && start) error = 'Bitte ein bekanntes Ende eingeben oder „Unbekannt“ auswählen.';
        const result = value && !error ? validateWithEdtf(value, ['Interval']) : { valid: !error, canonical: value };
        if (value && !result.valid && !error) error = 'Der Zeitraum ist kein gültiger EDTF-Level-1-Ausdruck.';
        if (!error && start && end && end !== '..') {
            const startRange = this.start.range();
            const endRange = this.end.range();
            if (startRange && endRange && endRange.max < startRange.min) error = 'Das Ende liegt vollständig vor dem Beginn.';
        }
        this.valid = !error && result.valid;
        this.input.value = result.valid ? result.canonical : value;
        this.output.value = this.input.value;
        this.text.textContent = this.intervalText(start, end, mode);
        this.error.textContent = error;
        this.host.setAttribute('aria-invalid', error ? 'true' : 'false');
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        return this.valid;
    }

    intervalText(start, end, mode) {
        const from = start ? `von ${interpretation(start)}` : 'mit unbekanntem Beginn';
        if (mode === 'ongoing') return `${from}; weiterhin andauernd`;
        if (mode === 'unknown') return `${from}; Ende unbekannt`;
        return end ? `${from} bis ${interpretation(end)}` : from;
    }
}

function initDateHost(host) {
    if (host.dataset.edtfReady) return;
    const input = document.getElementById(host.dataset.inputId);
    if (!input) return;
    host.dataset.edtfReady = 'true';
    new EdtfDateInput(host, input);
}

function initIntervalHost(host) {
    if (host.dataset.edtfReady) return;
    const input = host.nextElementSibling;
    if (!input?.matches('input[name="zeitraum[]"]')) return;
    host.dataset.edtfReady = 'true';
    new EdtfIntervalInput(host, input);
}

function validateChronology() {
    const birth = dateComponents.find(component => component.input.id === 'geburtsdatum');
    const death = dateComponents.find(component => component.input.id === 'sterbedatum');
    if (!birth || !death) return true;
    death.setError(death.valid ? '' : death.error.textContent);
    if (birth.range() && death.range() && death.range().max < birth.range().min) {
        death.setError('Das Sterbedatum liegt vollständig vor dem Geburtsdatum.');
        return false;
    }
    return true;
}

function validateAll() {
    const datesValid = dateComponents.filter(component => component.host.isConnected)
        .map(component => component.update(false)).every(Boolean);
    const intervalsValid = intervalComponents.filter(component => component.host.isConnected)
        .map(component => component.update()).every(Boolean);
    const chronologyValid = validateChronology();
    const living = document.querySelector('input[name="lebensstatus"]:checked')?.value === 'lebend';
    const death = document.getElementById('sterbedatum');
    if (living && death?.value) {
        dateComponents.find(component => component.input === death)?.setError('Bei einer lebenden Person darf kein Sterbedatum gespeichert sein.');
        return false;
    }
    return datesValid && intervalsValid && chronologyValid;
}

document.querySelectorAll('[data-edtf-date]').forEach(initDateHost);
document.querySelectorAll('[data-edtf-interval]').forEach(initIntervalHost);
document.addEventListener('edtf-entry-added', event => event.detail.querySelectorAll('[data-edtf-interval]').forEach(initIntervalHost));

let previousLifeStatus = document.querySelector('input[name="lebensstatus"]:checked')?.value;
function syncDeathAvailability() {
    const living = document.querySelector('input[name="lebensstatus"]:checked')?.value === 'lebend';
    const death = dateComponents.find(component => component.input.id === 'sterbedatum');
    death?.host.querySelectorAll('input, select').forEach(control => { control.disabled = living; });
}
document.querySelectorAll('input[name="lebensstatus"]').forEach(radio => radio.addEventListener('change', event => {
    const next = event.target.value;
    const deathInput = document.getElementById('sterbedatum');
    const deathComponent = dateComponents.find(component => component.input === deathInput);
    if (next === 'lebend' && deathInput?.value) {
        const confirmed = window.confirm('Es ist ein Sterbedatum eingetragen. Soll es wirklich gelöscht und der Lebensstatus auf „lebend“ geändert werden?');
        if (!confirmed) {
            const previous = document.querySelector(`input[name="lebensstatus"][value="${previousLifeStatus}"]`);
            if (previous) previous.checked = true;
            event.target.checked = false;
            previous?.dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }
        deathComponent?.clear();
    }
    previousLifeStatus = document.querySelector('input[name="lebensstatus"]:checked')?.value;
    syncDeathAvailability();
}));
syncDeathAvailability();

window.EDTFForm = { validateAll, parseLevelOne: value => validateWithEdtf(value, ['Date', 'Year', 'Decade', 'Century', 'Interval']) };
document.dispatchEvent(new Event('edtf-components-ready'));
})().catch(error => {
    console.error('EDTF.js konnte nicht geladen werden:', error);
    document.querySelectorAll('[data-edtf-date], [data-edtf-interval]').forEach(host => {
        host.innerHTML = '<div class="alert alert-danger" role="alert">Die Datumskomponente konnte nicht geladen werden. Bitte prüfen Sie die Internetverbindung.</div>';
    });
});
