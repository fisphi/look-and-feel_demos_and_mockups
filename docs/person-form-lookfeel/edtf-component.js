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
const dateLists = [];

function ensureEdtfInfoModal() {
    if (document.getElementById('edtfInfoModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="edtfInfoModal" tabindex="-1" aria-labelledby="edtfInfoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title" id="edtfInfoModalLabel">Was ist ein EDTF-Datum?</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button>
                    </div>
                    <div class="modal-body">
                        <p>EDTF steht für „Extended Date/Time Format“. Es erweitert das übliche Datumsformat um ungenaue, unsichere oder unvollständige historische Datumsangaben.</p>
                        <h3>Beispiele</h3>
                        <dl class="row mb-3">
                            <dt class="col-4"><code>1874-03-12</code></dt><dd class="col-8">12. März 1874</dd>
                            <dt class="col-4"><code>1874?</code></dt><dd class="col-8">vermutlich 1874</dd>
                            <dt class="col-4"><code>1874~</code></dt><dd class="col-8">ungefähr 1874</dd>
                            <dt class="col-4"><code>187X</code></dt><dd class="col-8">unbekanntes Jahr zwischen 1870 und 1879</dd>
                            <dt class="col-4"><code>18XX</code></dt><dd class="col-8">unbekanntes Jahr zwischen 1800 und 1899</dd>
                        </dl>
                        <a href="https://www.loc.gov/standards/datetime/" target="_blank" rel="noopener noreferrer">Offizielle EDTF-Spezifikation der Library of Congress</a>
                    </div>
                    <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button></div>
                </div>
            </div>
        </div>`);
}

function syncDateActionVisibility(component) {
    if (!component.action) return;
    const viewer = document.querySelector('input[name="userrolle"]:checked')?.value === 'user';
    const livingDeath = component.input.id === 'sterbedatum'
        && document.querySelector('input[name="lebensstatus"]:checked')?.value === 'lebend';
    component.action.hidden = viewer;
    component.action.disabled = viewer || livingDeath;
    if (livingDeath) {
        component.action.title = 'Sterbedatum kann bei einer lebenden Person nicht erfasst werden';
    } else {
        const accessibleName = component.action.getAttribute('aria-label');
        if (accessibleName) component.action.title = accessibleName;
    }
}

function syncAllDateActions() {
    dateComponents.filter(component => component.host.isConnected).forEach(syncDateActionVisibility);
    dateLists.filter(list => list.host.isConnected).forEach(list => list.refresh());
}

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
        this.label = label;
        this.actionLabel = this.options.actionLabel || label;
        const headingClass = this.options.hideHeading ? 'visually-hidden' : '';
        const heading = `<div class="mb-2 ${headingClass}">${label}</div>`;
        const monthOptions = MONTHS.map((month, index) =>
            `<option value="${String(index + 1).padStart(2, '0')}">${month}</option>`).join('');
        this.host.className = 'edtf-component';
        this.host.innerHTML = `
            <div class="edtf-compact-view border rounded p-3">
                ${heading}
                <div class="edtf-summary compact-value-grid">
                    <div data-empty-state>Unbekannt</div>
                    <div class="d-none form-label compact-value-label compact-value-label-primary" data-value-state>
                        <span>EDTF-Datum</span>
                        <button type="button" class="btn btn-link btn-sm p-0 edtf-info-action"
                            data-bs-toggle="modal" data-bs-target="#edtfInfoModal"
                            aria-label="EDTF-Datum erklären" title="EDTF-Datum erklären">
                            <i class="bi bi-question-circle" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="d-none form-label compact-value-label compact-value-label-detail" data-value-state>Interpretation</div>
                    <code class="d-none edtf-summary-value compact-value-primary" data-summary-value data-value-state></code>
                    <span class="d-none edtf-summary-interpretation compact-value-detail" data-summary-interpretation data-value-state></span>
                    <div class="compact-value-action" data-action-column>
                        <button type="button" class="btn btn-sm btn-outline-primary edtf-date-action"
                            data-edtf-action data-bs-toggle="modal" data-bs-target="#${this.id}-modal"></button>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="${this.id}-modal" tabindex="-1" aria-labelledby="${this.id}-modal-title" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content">
                    <div class="modal-header"><h2 class="modal-title" id="${this.id}-modal-title">${label}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button></div>
                    <div class="modal-body"><fieldset>
                        <legend class="visually-hidden">${label} als EDTF Level 1 erfassen</legend>
                        <div class="row g-2 align-items-end">
                            <div class="col-sm-6 col-lg-3"><label class="form-label" for="${this.id}-precision">Genauigkeit</label>
                                <select class="form-select" id="${this.id}-precision" data-part="precision"><option value="date">Vollständiges Datum</option><option value="month">Monat</option><option value="year">Jahr</option><option value="decade">Jahrzehnt</option><option value="century">Jahrhundert</option></select></div>
                            <div class="col-sm-6 col-lg-2"><label class="form-label" for="${this.id}-year">Jahr</label><input class="form-control" id="${this.id}-year" data-part="year" type="number" min="1" max="9999" inputmode="numeric"></div>
                            <div class="col-sm-6 col-lg-3" data-group="month"><label class="form-label" for="${this.id}-month">Monat</label><select class="form-select" id="${this.id}-month" data-part="month"><option value="">Bitte wählen</option>${monthOptions}</select></div>
                            <div class="col-sm-6 col-lg-2" data-group="day"><label class="form-label" for="${this.id}-day">Tag</label><input class="form-control" id="${this.id}-day" data-part="day" type="number" min="1" max="31" inputmode="numeric"></div>
                            <div class="col-sm-6 col-lg-2"><label class="form-label" for="${this.id}-evaluation">Bewertung</label><select class="form-select" id="${this.id}-evaluation" data-part="evaluation"><option value="exact">Genau</option><option value="approximate">Ungefähr</option><option value="uncertain">Unsicher</option><option value="both">Ungefähr und unsicher</option></select></div>
                        </div>
                        <div class="d-flex flex-wrap gap-3 mt-2">
                            <div class="form-check" data-group="unknown-month"><input class="form-check-input" id="${this.id}-unknown-month" data-part="unknownMonth" type="checkbox"><label class="form-check-label" for="${this.id}-unknown-month">Monat unbekannt</label></div>
                            <div class="form-check" data-group="unknown-day"><input class="form-check-input" id="${this.id}-unknown-day" data-part="unknownDay" type="checkbox"><label class="form-check-label" for="${this.id}-unknown-day">Tag unbekannt</label></div>
                        </div>
                        <div id="${this.id}-error" class="invalid-feedback d-block" role="status" aria-live="polite"></div>
                    </fieldset></div>
                    <div class="modal-footer"><button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fertig</button></div>
                </div></div>
            </div>`;
        this.controls = Object.fromEntries([...this.host.querySelectorAll('[data-part]')].map(control => [control.dataset.part, control]));
        this.action = this.host.querySelector('[data-edtf-action]');
        this.emptyState = this.host.querySelector('[data-empty-state]');
        this.valueStates = this.host.querySelectorAll('[data-value-state]');
        this.output = this.host.querySelector('[data-summary-value]');
        this.interpretation = this.host.querySelector('[data-summary-interpretation]');
        this.error = this.host.querySelector(`#${this.id}-error`);
        Object.entries(this.state).forEach(([part, value]) => {
            if (!this.controls[part]) return;
            if (this.controls[part].type === 'checkbox') this.controls[part].checked = value;
            else this.controls[part].value = value;
        });
        Object.values(this.controls).forEach(control => {
            control.setAttribute('aria-describedby', `${this.id}-error`);
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
        if (this.output) this.output.textContent = this.input.value;
        if (this.interpretation) this.interpretation.textContent = interpretation(this.input.value);
        this.updateCompactView();
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

    updateCompactView() {
        const hasValue = !!this.input.value;
        this.emptyState.classList.toggle('d-none', hasValue);
        this.valueStates.forEach(element => element.classList.toggle('d-none', !hasValue));
        this.setActionAppearance(hasValue);
        syncDateActionVisibility(this);
    }

    setActionAppearance(hasValue) {
        if (hasValue) {
            const accessibleName = `${this.actionLabel} bearbeiten`;
            this.action.className = 'btn btn-sm btn-outline-primary edtf-date-action edtf-edit-action';
            this.action.setAttribute('aria-label', accessibleName);
            this.action.title = accessibleName;
            this.action.innerHTML = '<i class="bi bi-pencil" aria-hidden="true"></i>';
        } else {
            const accessibleName = `${this.actionLabel} hinzufügen`;
            this.action.className = 'btn btn-sm btn-outline-primary edtf-date-action';
            this.action.setAttribute('aria-label', accessibleName);
            this.action.title = accessibleName;
            this.action.innerHTML = '<i class="bi bi-plus-circle me-1" aria-hidden="true"></i>Datum hinzufügen';
        }
    }

    loadValue(value) {
        this.state = stateFromValue(value);
        Object.entries(this.state).forEach(([part, partValue]) => {
            const control = this.controls[part];
            if (!control) return;
            if (control.type === 'checkbox') control.checked = partValue;
            else control.value = partValue;
        });
        this.update();
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

function configureTransactionalDate(component, options) {
    const modal = component.host.querySelector('.modal');
    const title = modal.querySelector('.modal-title');
    const footer = modal.querySelector('.modal-footer');
    footer.innerHTML = `
        <button type="button" class="btn btn-outline-danger me-auto" data-remove-date>Datum entfernen</button>
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
        <button type="button" class="btn btn-primary" data-apply-date>Übernehmen</button>`;
    const removeButton = footer.querySelector('[data-remove-date]');
    let newEntry = !!options.isNew;
    let applied = false;
    let deleting = false;
    let snapshot = component.input.value;
    let triggerElement = null;

    modal.addEventListener('show.bs.modal', () => {
        triggerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        snapshot = component.input.value;
        applied = false;
        deleting = false;
        const adding = newEntry || !snapshot;
        title.textContent = adding ? options.addTitle : options.editTitle;
        removeButton.classList.toggle('d-none', adding);
    });
    modal.addEventListener('shown.bs.modal', () => {
        const firstControl = component.controls.precision || component.controls.year;
        firstControl?.focus();
    });
    modal.addEventListener('hidden.bs.modal', () => {
        if (deleting) options.onRemove?.();
        else if (newEntry && !applied) options.onCancelNew?.();
        else if (!applied) component.loadValue(snapshot);
        options.onAfterClose?.();
        if (triggerElement?.isConnected) triggerElement.focus();
        triggerElement = null;
    });
    footer.querySelector('[data-apply-date]').addEventListener('click', () => {
        if (!component.update(false) || !component.input.value) {
            if (!component.input.value) component.setError('Bitte geben Sie ein Datum an.');
            return;
        }
        if (options.validateCommit && !options.validateCommit()) {
            options.onInvalid?.(snapshot);
            return;
        }
        applied = true;
        newEntry = false;
        component.input.dispatchEvent(new Event('input', { bubbles: true }));
        options.onApply?.();
        bootstrap.Modal.getOrCreateInstance(modal).hide();
    });
    removeButton.addEventListener('click', () => {
        if (!window.confirm(options.removeConfirm || 'Dieses Datum wirklich entfernen?')) return;
        deleting = true;
        bootstrap.Modal.getOrCreateInstance(modal).hide();
    });
}

class EdtfDateList {
    constructor(host) {
        this.host = host;
        this.label = host.dataset.label || 'Datum ohne Kontext (EDTF)';
        this.itemLabel = host.dataset.itemLabel || 'Datum ohne Kontext';
        this.description = host.dataset.description || '';
        this.name = host.dataset.name || 'datum_ohne_kontext';
        this.id = `edtf-list-${++componentCounter}`;
        const existingValues = [...host.querySelectorAll(`input[name="${this.name}"], input[name="${this.name}[]"]`)]
            .map(input => input.value.trim()).filter(Boolean);
        this.render();
        existingValues.forEach(value => this.createEntry(value, false));
        this.refresh();
        dateLists.push(this);
    }

    render() {
        this.host.className = 'edtf-date-list repeatable-entry-list';
        this.host.innerHTML = `
            <h4 class="form-subsection-title">${this.label}</h4>
            <div class="form-empty-state mt-3 mb-3" data-list-empty>
                <div class="form-empty-state-title">${this.description || 'Noch keine weiteren Datumsangaben erfasst.'}</div>
            </div>
            <div class="d-grid gap-3 mb-3 repeatable-entry-items" data-list-entries></div>
            <div class="section-actions">
                <button type="button" class="btn btn-sm btn-outline-primary" data-list-add
                    aria-label="${this.itemLabel} hinzufügen">
                    <i class="bi bi-plus-circle me-1" aria-hidden="true"></i><span data-list-add-label>Datum hinzufügen</span>
                </button>
            </div>`;
        this.emptyState = this.host.querySelector('[data-list-empty]');
        this.entries = this.host.querySelector('[data-list-entries]');
        this.addButton = this.host.querySelector('[data-list-add]');
        this.addButtonLabel = this.host.querySelector('[data-list-add-label]');
        this.addButton.addEventListener('click', () => this.createEntry('', true));
    }

    createEntry(value, isNew) {
        const entryId = `${this.id}-entry-${++componentCounter}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'edtf-date-list-entry repeatable-entry';
        wrapper.id = entryId;
        wrapper.dataset.edtfEntryId = entryId;
        const componentHost = document.createElement('div');
        componentHost.dataset.label = this.itemLabel;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `${this.name}[]`;
        input.value = value;
        wrapper.append(componentHost, input);
        this.entries.appendChild(wrapper);

        const component = new EdtfDateInput(componentHost, input, { label: this.itemLabel, hideHeading: true });
        this.configureEntryModal(wrapper, component, isNew);
        if (isNew) {
            // The modal lives inside the entry. Hiding the complete wrapper also
            // hides the Bootstrap modal, even though Bootstrap marks it as open.
            wrapper.dataset.draft = 'true';
            component.host.querySelector('.edtf-compact-view').hidden = true;
            bootstrap.Modal.getOrCreateInstance(component.host.querySelector('.modal')).show();
        }
        this.refresh();
        return component;
    }

    configureEntryModal(wrapper, component, isNew) {
        configureTransactionalDate(component, {
            isNew,
            addTitle: `${this.itemLabel} hinzufügen`,
            editTitle: `${this.itemLabel} bearbeiten`,
            removeConfirm: 'Dieses Datum ohne Kontext wirklich entfernen?',
            onApply: () => {
                delete wrapper.dataset.draft;
                component.host.querySelector('.edtf-compact-view').hidden = false;
                this.refresh();
            },
            onCancelNew: () => wrapper.remove(),
            onRemove: () => wrapper.remove(),
            onAfterClose: () => this.refresh()
        });
    }

    refresh() {
        const hasEntries = [...this.entries.querySelectorAll('.edtf-date-list-entry')]
            .some(entry => entry.dataset.draft !== 'true'
                && entry.querySelector(`input[name="${this.name}[]"]`)?.value);
        this.emptyState.classList.toggle('d-none', hasEntries);
        this.addButtonLabel.textContent = hasEntries ? 'Weiteres Datum hinzufügen' : 'Datum hinzufügen';
        this.addButton.setAttribute('aria-label', hasEntries
            ? 'Weiteres Datum ohne Kontext hinzufügen'
            : 'Datum ohne Kontext hinzufügen');
        const viewer = document.querySelector('input[name="userrolle"]:checked')?.value === 'user';
        this.addButton.hidden = viewer;
        this.addButton.disabled = viewer;
    }

    clear() {
        this.entries.replaceChildren();
        this.refresh();
    }
}

class EdtfIntervalInput {
    constructor(host, input, options = {}) {
        this.host = host;
        this.input = input;
        this.options = options;
        this.id = `edtf-interval-${++componentCounter}`;
        const [start = '', end = ''] = (input.value || '').split('/');
        this.endMode = end === '..' ? 'ongoing' : end === '' ? 'unknown' : 'known';
        this.render(start, this.endMode === 'known' ? end : '');
        intervalComponents.push(this);
    }

    render(start, end) {
        this.host.className = 'edtf-interval border rounded p-3';
        const boundaryClass = this.options.boundaryClass || 'col-12';
        this.host.innerHTML = `
            <fieldset><legend class="fs-6 fw-semibold">${this.options.intervalLabel || 'Tätigkeitszeitraum'}</legend>
                <div class="row g-3"><div class="${boundaryClass}" data-start-host></div>
                <div class="${boundaryClass}" data-end-host></div></div>
                <div class="row g-2 mt-2"><div class="col-sm-4"><label class="form-label" for="${this.id}-output">EDTF-Zeitraum</label><input id="${this.id}-output" class="form-control edtf-output" readonly aria-describedby="${this.id}-text ${this.id}-error"></div>
                <div class="col-sm-8"><div class="form-label">Interpretation</div><div id="${this.id}-text" class="form-control-plaintext"></div></div></div>
                <div id="${this.id}-error" class="invalid-feedback d-block" role="status" aria-live="polite"></div>
            </fieldset>`;
        const startInput = document.createElement('input'); startInput.type = 'hidden'; startInput.value = start;
        const endInput = document.createElement('input'); endInput.type = 'hidden'; endInput.value = end;
        this.start = new EdtfDateInput(this.host.querySelector('[data-start-host]'), startInput, {
            label: this.options.startLabel || 'Beginn',
            actionLabel: this.options.startActionLabel,
            onChange: () => this.update()
        });
        this.end = new EdtfDateInput(this.host.querySelector('[data-end-host]'), endInput, {
            label: this.options.endLabel || 'Ende',
            actionLabel: this.options.endActionLabel,
            onChange: () => this.update()
        });
        if (this.options.transactionalDates) {
            configureTransactionalDate(this.start, {
                addTitle: `${this.options.startActionLabel} hinzufügen`,
                editTitle: `${this.options.startActionLabel} bearbeiten`,
                removeConfirm: 'Den Beginn dieses Wirkungsorts wirklich entfernen?',
                validateCommit: () => {
                    const valid = this.update();
                    if (!valid) this.start.setError(this.error.textContent);
                    return valid;
                },
                onInvalid: snapshot => {
                    const message = this.error.textContent;
                    this.start.loadValue(snapshot);
                    this.update();
                    this.start.setError(message);
                },
                onApply: () => this.update(),
                onRemove: () => { this.start.loadValue(''); this.update(); }
            });
        }
        this.configureEndModal();
        this.output = this.host.querySelector('.edtf-output');
        this.text = this.host.querySelector(`#${this.id}-text`);
        this.error = this.host.querySelector(`#${this.id}-error`);
        this.update();
    }

    configureEndModal() {
        const modal = this.end.host.querySelector('.modal');
        const modalBody = modal.querySelector('.modal-body');
        modalBody.insertAdjacentHTML('afterbegin', `
            <div class="mb-3">
                <label class="form-label" for="${this.id}-end-mode">Endzustand</label>
                <select id="${this.id}-end-mode" class="form-select" data-end-mode>
                    <option value="known">Bekanntes Datum</option>
                    <option value="unknown">Unbekannt</option>
                    <option value="ongoing">Weiterhin andauernd</option>
                </select>
            </div>`);
        this.modeControl = modal.querySelector('[data-end-mode]');
        this.endMask = modalBody.querySelector('fieldset');
        const footer = modal.querySelector('.modal-footer');
        footer.innerHTML = `
            <button type="button" class="btn btn-outline-danger me-auto" data-remove-date>Datum entfernen</button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Abbrechen</button>
            <button type="button" class="btn btn-primary" data-apply-end-state>Übernehmen</button>`;
        const removeButton = footer.querySelector('[data-remove-date]');

        const actionColumn = this.end.host.querySelector('[data-action-column]');
        actionColumn.insertAdjacentHTML('beforebegin', '<div class="col-12 col-md d-none" data-end-special-state><span>Weiterhin andauernd</span></div>');
        this.endSpecialState = this.end.host.querySelector('[data-end-special-state]');

        const toggleEndMask = () => {
            this.endMask.classList.toggle('d-none', this.modeControl.value !== 'known');
        };
        this.modeControl.addEventListener('change', toggleEndMask);
        modal.addEventListener('show.bs.modal', () => {
            this.endSnapshot = { mode: this.endMode, value: this.end.input.value };
            this.endApplied = false;
            this.modeControl.value = this.endMode;
            const adding = this.endMode === 'unknown' && !this.end.input.value;
            modal.querySelector('.modal-title').textContent = adding
                ? `${this.options.endActionLabel || 'Ende'} hinzufügen`
                : `${this.options.endActionLabel || 'Ende'} bearbeiten`;
            removeButton.classList.toggle('d-none', adding);
            toggleEndMask();
        });
        modal.addEventListener('hidden.bs.modal', () => {
            if (!this.endApplied && this.endSnapshot) {
                this.endMode = this.endSnapshot.mode;
                this.end.loadValue(this.endSnapshot.value);
                this.update();
            }
            this.endSnapshot = null;
        });
        footer.querySelector('[data-apply-end-state]').addEventListener('click', () => {
            if (this.modeControl.value === 'known' && (!this.end.update(false) || !this.end.input.value)) {
                if (!this.end.input.value) this.end.setError('Bitte geben Sie ein Datum an.');
                return;
            }
            this.endApplied = true;
            this.endMode = this.modeControl.value;
            if (this.endMode !== 'known') this.end.loadValue('');
            if (!this.update()) {
                const message = this.error.textContent;
                this.endApplied = false;
                this.endMode = this.endSnapshot.mode;
                this.end.loadValue(this.endSnapshot.value);
                this.update();
                this.end.setError(message);
                return;
            }
            bootstrap.Modal.getOrCreateInstance(modal).hide();
        });
        removeButton.addEventListener('click', () => {
            if (!window.confirm('Das Ende dieses Wirkungsorts wirklich entfernen?')) return;
            this.endApplied = true;
            this.endMode = 'unknown';
            this.end.loadValue('');
            this.update();
            bootstrap.Modal.getOrCreateInstance(modal).hide();
        });
    }

    update() {
        const start = this.start.input.value;
        const mode = this.endMode;
        const end = mode === 'ongoing' ? '..' : mode === 'unknown' ? '' : this.end.input.value;
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
        this.updateEndCompactView(mode);
        this.error.textContent = error;
        this.host.setAttribute('aria-invalid', error ? 'true' : 'false');
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        return this.valid;
    }

    updateEndCompactView(mode) {
        const ongoing = mode === 'ongoing';
        this.endSpecialState.classList.toggle('d-none', !ongoing);
        if (ongoing) {
            this.end.emptyState.classList.add('d-none');
            this.end.valueStates.forEach(element => element.classList.add('d-none'));
            this.end.setActionAppearance(true);
        } else {
            this.end.updateCompactView();
        }
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
    new EdtfDateInput(host, input, { hideHeading: host.dataset.hideHeading === 'true' });
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

ensureEdtfInfoModal();
document.querySelectorAll('[data-edtf-date]').forEach(initDateHost);
document.querySelectorAll('[data-edtf-date-list]').forEach(host => new EdtfDateList(host));
document.querySelectorAll('[data-edtf-interval]').forEach(initIntervalHost);
document.addEventListener('edtf-entry-added', event => event.detail.querySelectorAll('[data-edtf-interval]').forEach(initIntervalHost));

let previousLifeStatus = document.querySelector('input[name="lebensstatus"]:checked')?.value;
function syncDeathAvailability() {
    const living = document.querySelector('input[name="lebensstatus"]:checked')?.value === 'lebend';
    const death = dateComponents.find(component => component.input.id === 'sterbedatum');
    death?.host.querySelectorAll('input, select').forEach(control => { control.disabled = living; });
    syncAllDateActions();
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
document.addEventListener('person-role-changed', syncAllDateActions);

window.EDTFForm = {
    validateAll,
    parseLevelOne: value => validateWithEdtf(value, ['Date', 'Year', 'Decade', 'Century', 'Interval']),
    resetDateLists: () => dateLists.forEach(list => list.clear())
};
document.dispatchEvent(new Event('edtf-components-ready'));
})().catch(error => {
    console.error('EDTF.js konnte nicht geladen werden:', error);
    document.querySelectorAll('[data-edtf-date], [data-edtf-interval]').forEach(host => {
        host.innerHTML = '<div class="alert alert-danger" role="alert">Die Datumskomponente konnte nicht geladen werden. Bitte prüfen Sie die Internetverbindung.</div>';
    });
});
