// User-Rolle Gate-Logik
(function() {
    const userRolleRadios = document.querySelectorAll('input[name="userrolle"]');
    const allSections = document.querySelectorAll('.form-section');
    
    function updateRolePermissions() {
        const selectedRole = document.querySelector('input[name="userrolle"]:checked');
        
        if (!selectedRole) {
            // Keine Rolle gewählt - alle Sektionen außer User-Rolle deaktivieren
            allSections.forEach(section => {
                if (section.id !== 'userrolle') {
                    section.classList.remove('d-none');
                    section.classList.add('disabled-section');
                }
            });
            return;
        }
        
        const role = selectedRole.value;
        
        // Alle Sektionen durchgehen und basierend auf Rolle aktivieren/deaktivieren
        allSections.forEach(section => {
            if (section.id === 'userrolle') return; // User-Rolle selbst immer aktiv
            
            const restrictions = section.dataset.roleRestriction;
            const hideWhenRestricted = section.dataset.hideWhenRestricted === 'true';
            
            if (!restrictions) {
                // Keine Einschränkungen - Sektion verfügbar
                section.classList.remove('disabled-section');
                section.classList.remove('d-none');
                return;
            }
            
            const restrictedRoles = restrictions.split(',');
            
            if (restrictedRoles.includes(role)) {
                // Rolle ist eingeschränkt für diese Sektion
                if (hideWhenRestricted) {
                    section.classList.add('d-none');
                    section.classList.remove('disabled-section');
                } else {
                    section.classList.remove('d-none');
                    section.classList.add('disabled-section');
                }
            } else {
                // Rolle darf diese Sektion bearbeiten
                section.classList.remove('disabled-section');
                section.classList.remove('d-none');
            }
        });
        
        // Spezialfall: normale User - nur Kommentarfunktion
        if (role === 'user') {
            // Alle Formularfelder deaktivieren, aber Kommentar-Buttons aktiv lassen
            const commentButtons = document.querySelectorAll('.btn-sm.btn-outline-secondary');
            commentButtons.forEach(btn => {
                if (btn.textContent.includes('Kommentar abgeben')) {
                    btn.disabled = false;
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                }
            });
        }
        
        // Lebensstatus-Gate weiterhin anwenden
        updateFormState();
    }
    
    // Event-Listener für User-Rolle
    userRolleRadios.forEach(radio => {
        radio.addEventListener('change', updateRolePermissions);
    });
    
    // Initial state
    updateRolePermissions();
})();

// Anzeigename Auto-Update (erweitert)
(function() {
    const vornameInput = document.getElementById('vorname');
    const mittelnameInput = document.getElementById('mittelname');
    const nachnameInput = document.getElementById('nachname');
    const geburtsInput = document.getElementById('geburtsdatum');
    const sterbeInput = document.getElementById('sterbedatum');
    const wirkVonInput = document.getElementById('wirkungszeitraum_von');
    const wirkBisInput = document.getElementById('wirkungszeitraum_bis');

    const anzeigeNameDisplay = document.getElementById('anzeigeNameDisplay');
    const anzeigeNameDates = document.getElementById('anzeigeNameDates');
    const collectionSuffix = ' [VS]';
    const normdatenFields = [
        {
            id: 'gnd',
            label: 'GND',
            formatter: (value) => {
                const safeValue = escapeHtml(value);
                const encodedValue = encodeURIComponent(value.trim());
                const url = `https://explore.gnd.network/gnd/${encodedValue}`;
                return `[GND: <a href="${url}" target="_blank" rel="noopener noreferrer">${safeValue}</a>]`;
            }
        },
        { id: 'viaf', label: 'VIAF' },
        {
            id: 'orcid',
            label: 'ORCID',
            formatter: (value) => {
                const trimmedValue = value.trim();
                const isUrl = /^https?:\/\//i.test(trimmedValue);
                const orcidId = isUrl ? trimmedValue.replace(/^https?:\/\/orcid\.org\//i, '') : trimmedValue;
                const safeId = escapeHtml(orcidId);
                const url = isUrl ? trimmedValue : `https://orcid.org/${encodeURIComponent(orcidId)}`;
                return `[ORCID: <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${safeId}</a>]`;
            }
        },
        { id: 'wikidata', label: 'Wikidata' },
        { id: 'isni', label: 'ISNI' },
        { id: 'lcnaf', label: 'LCNAF' },
        { id: 'bnf', label: 'BNF' },
        { id: 'bhl', label: 'BHL' },
        { id: 'zoobank', label: 'ZooBank' },
        { id: 'zobodat', label: 'ZOBODAT' },
        { id: 'wikipedia', label: 'Wikipedia' },
        { id: 'ulan', label: 'ULAN' },
        { id: 'ipni', label: 'IPNI' }
    ];

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function updateAnzeigename() {
        const vorname = (vornameInput && vornameInput.value || '').trim();
        const mittel = (mittelnameInput && mittelnameInput.value || '').trim();
        const nach = (nachnameInput && nachnameInput.value || '').trim();

        const nameParts = [vorname, mittel, nach].filter(p => p !== '');
        const displayNameBase = nameParts.length ? nameParts.join(' ') : '—';

        // Dates
        const geb = (geburtsInput && geburtsInput.value || '').trim();
        const sterb = (sterbeInput && sterbeInput.value || '').trim();
        const v = (wirkVonInput && wirkVonInput.value || '').trim();
        const b = (wirkBisInput && wirkBisInput.value || '').trim();

        const datePieces = [];
        if (geb) datePieces.push('[* ' + geb + ']');
        if (sterb) datePieces.push('[† ' + sterb + ']');
        if (v || b) {
            if (v && b) datePieces.push('[fl. ' + v + '–' + b + ']');
            else if (v) datePieces.push('[fl. ab ' + v + ']');
            else datePieces.push('[fl. bis ' + b + ']');
        }
        const normdatenSuffixes = normdatenFields.map(field => {
            const input = document.getElementById(field.id);
            if (!input) return null;
            const value = (input.value || '').trim();
            if (!value) return null;
            if (typeof field.formatter === 'function') {
                return field.formatter(value);
            }
            return `[${field.label}: ${escapeHtml(value)}]`;
        }).filter(Boolean);

        anzeigeNameDisplay.textContent = displayNameBase;

        const metaParts = [];
        if (datePieces.length) {
            metaParts.push(datePieces.map(escapeHtml).join(' · '));
        }
        metaParts.push(escapeHtml(collectionSuffix.trim()));
        if (normdatenSuffixes.length) {
            metaParts.push(...normdatenSuffixes);
        }
        anzeigeNameDates.innerHTML = metaParts.join(' · ');
    }

    // attach listeners if elements exist
    [
        vornameInput,
        mittelnameInput,
        nachnameInput,
        geburtsInput,
        sterbeInput,
        wirkVonInput,
        wirkBisInput,
        ...normdatenFields.map(field => document.getElementById(field.id)).filter(Boolean)
    ].forEach(el => {
        if (el) el.addEventListener('input', updateAnzeigename);
    });

    // initial
    updateAnzeigename();
})();

// Tätigkeiten / Rollen - Repeatable Section
(function() {
    let taetigkeitenCounter = 1;
    
    window.addRolleToEntry = function(button, entryId) {
        const container = document.querySelector(`.rollen-container-${entryId}`);
        const rolleRow = document.createElement('div');
        rolleRow.className = 'dynamic-field-row';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'autocomplete-wrapper flex-grow-1';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control autocomplete-input';
        input.name = `rollen_${entryId}[]`;
        input.dataset.autocomplete = 'rollen';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-outline-danger btn-sm';
        removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
        removeBtn.onclick = () => rolleRow.remove();
        
        rolleRow.appendChild(wrapper);
        rolleRow.appendChild(removeBtn);
        container.appendChild(rolleRow);
        
        // Initialize autocomplete for new field
        initAutocomplete(input, dropdown, 'rollen');
    };
    
    document.getElementById('addTaetigkeitBtn').addEventListener('click', function() {
        taetigkeitenCounter++;
        const container = document.getElementById('taetigkeiten-container');
        
        const entry = document.createElement('div');
        entry.className = 'taetigkeiten-entry border rounded p-3 mb-3';
        entry.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">Tätigkeit #${taetigkeitenCounter}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('.taetigkeiten-entry').remove()">
                    <i class="bi bi-trash"></i> Entfernen
                </button>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Beruf / Funktion</label>
                    <input type="text" class="form-control" name="beruf_funktion[]">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Institution</label>
                    <div class="autocomplete-wrapper">
                        <input type="text" class="form-control autocomplete-input" 
                               name="institution[]"
                               data-autocomplete="institutionen">
                        <div class="autocomplete-dropdown"></div>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Abteilung</label>
                    <input type="text" class="form-control" name="abteilung[]">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Zeitraum</label>
                    <input type="text" class="form-control" name="zeitraum[]" placeholder="z.B. 1990-2000">
                </div>
                <div class="col-12">
                    <label class="form-label">Rollen</label>
                    <div class="rollen-container-${taetigkeitenCounter}"></div>
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="addRolleToEntry(this, ${taetigkeitenCounter})">
                        <i class="bi bi-plus-circle"></i> Rolle hinzufügen
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(entry);
        
        // Initialize autocomplete for institution field
        const institutionInput = entry.querySelector('[data-autocomplete="institutionen"]');
        const institutionDropdown = institutionInput.nextElementSibling;
        initAutocomplete(institutionInput, institutionDropdown, 'institutionen');
        
        // Add initial role field
        addRolleToEntry(entry.querySelector('.btn-outline-primary'), taetigkeitenCounter);
    });
    
    // Initialize autocomplete for pre-filled entry
    document.querySelectorAll('.taetigkeiten-entry').forEach((entry, index) => {
        const institutionInput = entry.querySelector('[data-autocomplete="institutionen"]');
        if (institutionInput) {
            const dropdown = institutionInput.nextElementSibling;
            initAutocomplete(institutionInput, dropdown, 'institutionen');
        }
        
        // Initialize autocomplete for pre-filled roles
        entry.querySelectorAll('[data-autocomplete="rollen"]').forEach(input => {
            const dropdown = input.nextElementSibling;
            initAutocomplete(input, dropdown, 'rollen');
        });
        
        // Add remove functionality to pre-filled role buttons
        entry.querySelectorAll('.dynamic-field-row button').forEach(btn => {
            btn.onclick = () => btn.closest('.dynamic-field-row').remove();
        });
    });
})();

// Gate-Logik für Lebensstatus
(function() {
    const lebensstatusRadios = document.querySelectorAll('input[name="lebensstatus"]');
    const sections = document.querySelectorAll('.form-section.disabled-section');
    const einwilligungCheckbox = document.getElementById('einwilligung');
    const kontaktFields = document.getElementById('kontakt-fields');
    const sterbedatum = document.getElementById('sterbedatum');
    const sterbeort = document.getElementById('sterbeort');
    
    function updateFormState() {
        const selectedStatus = document.querySelector('input[name="lebensstatus"]:checked');
        if (!selectedStatus) return;
        const status = selectedStatus.value;
        // Geschlecht inputs beeinflussen: bei "lebend" deaktivieren und Auswahl entfernen
        const geschlechtInputs = document.querySelectorAll('input[name="geschlecht"]');
        if (status === 'lebend') {
            geschlechtInputs.forEach(i => { i.checked = false; i.disabled = true; });
        } else {
            geschlechtInputs.forEach(i => { i.disabled = false; });
        }
        
        // Sterbedaten-Logik
        if (status === 'lebend') {
            sterbedatum.disabled = true;
            sterbeort.disabled = true;
            sterbedatum.value = '';
            sterbeort.value = '';
        } else {
            sterbedatum.disabled = false;
            sterbeort.disabled = false;
        }
        
        // Kontakt-Logik
        updateKontaktFields();
    }
    
    function updateKontaktFields() {
        const selectedStatus = document.querySelector('input[name="lebensstatus"]:checked');
        const selectedRole = document.querySelector('input[name="userrolle"]:checked');
        const status = selectedStatus ? selectedStatus.value : null;
        const role = selectedRole ? selectedRole.value : null;
        const einwilligung = einwilligungCheckbox.checked;
        
        const kontaktInputs = kontaktFields.querySelectorAll('input, textarea');
        
        // Kontaktfelder nur aktiv wenn: lebend + einwilligung + (Rolle erlaubt Kontakt)
        const roleAllowsContact = role === 'kurator' || role === 'kustode';
        
        if (status === 'lebend' && einwilligung && roleAllowsContact) {
            kontaktInputs.forEach(input => input.disabled = false);
        } else {
            kontaktInputs.forEach(input => {
                input.disabled = true;
                if (status !== 'lebend') {
                    input.value = '';
                }
            });
        }
    }
    
    // Event-Listener
    lebensstatusRadios.forEach(radio => {
        radio.addEventListener('change', updateFormState);
    });
    
    einwilligungCheckbox.addEventListener('change', updateKontaktFields);
    
    // Initial state
    updateFormState();
})();

// Dynamische Felder
(function() {
    const dynamicFieldsConfig = {
        namensvarianten: {
            container: 'namensvarianten-container',
            name: 'namensvarianten',
            placeholder: 'Namensvariante',
            autocomplete: null
        },
        rollen: {
            container: 'rollen-container',
            name: 'rollen',
            placeholder: 'Rolle',
            autocomplete: 'rollen'
        },
        wirkungsorte: {
            container: 'wirkungsorte-container',
            name: 'wirkungsorte',
            placeholder: 'Wirkungsort',
            autocomplete: 'wirkungsorte',
            withDates: true
        },
        datumOhneKontext: {
            container: 'datum-ohne-kontext-container',
            name: 'datum_ohne_kontext',
            placeholder: 'YYYY oder YYYY-MM oder YYYY-MM-DD',
            autocomplete: null,
            validate: 'edtf'
        }
    };
    
    function createDynamicField(config, index) {
        const row = document.createElement('div');
        row.className = 'dynamic-field-row';
        row.dataset.index = index;
        
        if (config.withDates) {
            // Wirkungsort with date fields
            const ortWrapper = document.createElement('div');
            ortWrapper.className = 'autocomplete-wrapper';
            ortWrapper.style.flex = '2';
            
            const ortInput = document.createElement('input');
            ortInput.type = 'text';
            ortInput.className = 'form-control autocomplete-input';
            ortInput.name = `${config.name}[]`;
            ortInput.placeholder = config.placeholder;
            ortInput.dataset.autocomplete = config.autocomplete;
            
            const ortDropdown = document.createElement('div');
            ortDropdown.className = 'autocomplete-dropdown';
            
            ortWrapper.appendChild(ortInput);
            ortWrapper.appendChild(ortDropdown);
            row.appendChild(ortWrapper);
            
            // Von (EDTF)
            const vonInput = document.createElement('input');
            vonInput.type = 'text';
            vonInput.className = 'form-control';
            vonInput.name = `${config.name}_von[]`;
            vonInput.placeholder = 'Von (EDTF)';
            vonInput.dataset.validate = 'edtf';
            vonInput.style.flex = '1';
            row.appendChild(vonInput);
            
            // Bis (EDTF)
            const bisInput = document.createElement('input');
            bisInput.type = 'text';
            bisInput.className = 'form-control';
            bisInput.name = `${config.name}_bis[]`;
            bisInput.placeholder = 'Bis (EDTF)';
            bisInput.dataset.validate = 'edtf';
            bisInput.style.flex = '1';
            row.appendChild(bisInput);
            
            // Initialize autocomplete
            initAutocomplete(ortInput, ortDropdown, config.autocomplete);
            
        } else if (config.autocomplete) {
            const wrapper = document.createElement('div');
            wrapper.className = 'autocomplete-wrapper flex-grow-1';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control autocomplete-input';
            input.name = `${config.name}[]`;
            input.placeholder = config.placeholder;
            input.dataset.autocomplete = config.autocomplete;
            
            if (config.validate) {
                input.dataset.validate = config.validate;
            }
            
            const dropdown = document.createElement('div');
            dropdown.className = 'autocomplete-dropdown';
            
            wrapper.appendChild(input);
            wrapper.appendChild(dropdown);
            row.appendChild(wrapper);
            
            // Autocomplete initialisieren
            initAutocomplete(input, dropdown, config.autocomplete);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control flex-grow-1';
            input.name = `${config.name}[]`;
            input.placeholder = config.placeholder;
            
            if (config.validate) {
                input.dataset.validate = config.validate;
            }
            
            row.appendChild(input);
        }
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-outline-danger btn-sm';
        removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
        removeBtn.onclick = () => row.remove();
        
        row.appendChild(removeBtn);
        
        return row;
    }
    
    function addDynamicField(fieldType) {
        const config = dynamicFieldsConfig[fieldType];
        const container = document.getElementById(config.container);
        const index = container.children.length;
        const field = createDynamicField(config, index);
        container.appendChild(field);
    }
    
    // Event-Listener für Add-Buttons
    document.querySelectorAll('[data-dynamic-add]').forEach(button => {
        button.addEventListener('click', function() {
            const fieldType = this.dataset.dynamicAdd;
            addDynamicField(fieldType);
        });
    });
    
    // Add remove functionality to pre-filled entries
    document.querySelectorAll('.dynamic-field-row button').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.dynamic-field-row').remove();
        });
    });
    
    // Initial je ein Feld hinzufügen (außer namensvarianten - bereits vorgefüllt)
    Object.keys(dynamicFieldsConfig).forEach(fieldType => {
        if (fieldType !== 'namensvarianten' && fieldType !== 'rollen') {
            addDynamicField(fieldType);
        }
    });
})();

// Autocomplete-Funktionalität
function initAutocomplete(input, dropdown, dataKey) {
    const data = autocompleteData[dataKey] || [];
    let activeIndex = -1;
    
    function filterData(query) {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return data.filter(item => 
            item.toLowerCase().includes(lowerQuery)
        );
    }
    
    function showDropdown(items) {
        dropdown.innerHTML = '';
        
        if (items.length === 0) {
            dropdown.classList.remove('show');
            return;
        }
        
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = item;
            div.dataset.index = index;
            
            div.addEventListener('click', () => {
                input.value = item;
                dropdown.classList.remove('show');
                input.focus();
            });
            
            dropdown.appendChild(div);
        });
        
        dropdown.classList.add('show');
        activeIndex = -1;
    }
    
    function hideDropdown() {
        dropdown.classList.remove('show');
        activeIndex = -1;
    }
    
    function updateActiveItem() {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        items.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    input.addEventListener('input', function() {
        const filtered = filterData(this.value);
        showDropdown(filtered);
    });
    
    input.addEventListener('focus', function() {
        if (this.value) {
            const filtered = filterData(this.value);
            showDropdown(filtered);
        }
    });
    
    input.addEventListener('blur', function() {
        setTimeout(() => hideDropdown(), 200);
    });
    
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            updateActiveItem();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, -1);
            updateActiveItem();
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            items[activeIndex].click();
        } else if (e.key === 'Escape') {
            hideDropdown();
        }
    });
}

// Autocomplete für statische Felder initialisieren
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.autocomplete-input').forEach(input => {
        const dataKey = input.dataset.autocomplete;
        const dropdown = input.nextElementSibling;
        if (dataKey && dropdown && dropdown.classList.contains('autocomplete-dropdown')) {
            initAutocomplete(input, dropdown, dataKey);
        }
    });
});

// JSON-Export
document.getElementById('exportJson').addEventListener('click', function() {
    if (!validateForm()) {
        alert('Bitte korrigieren Sie die Fehler im Formular.');
        return;
    }
    
    const formData = {};
    const form = document.getElementById('personForm');
    
    // Einfache Felder
    const inputs = form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([name*="[]"]), textarea, select');
    inputs.forEach(input => {
        if (!input.disabled && input.name && input.value) {
            formData[input.name] = input.value;
        }
    });
    
    // Radio-Buttons
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        if (!radio.disabled && radio.name) {
            formData[radio.name] = radio.value;
        }
    });
    
    // Checkboxen
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.disabled && checkbox.name) {
            formData[checkbox.name] = checkbox.checked;
        }
    });
    
    // Dynamische Felder (Arrays)
    const dynamicFields = {
        namensvarianten: [],
        rollen: [],
        wirkungsorte: []
    };
    
    Object.keys(dynamicFields).forEach(fieldName => {
        const inputs = form.querySelectorAll(`input[name="${fieldName}[]"]`);
        inputs.forEach(input => {
            if (!input.disabled && input.value.trim()) {
                dynamicFields[fieldName].push(input.value.trim());
            }
        });
        if (dynamicFields[fieldName].length > 0) {
            formData[fieldName] = dynamicFields[fieldName];
        }
    });
    
    // JSON erstellen und herunterladen
    const json = JSON.stringify(formData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `person_${timestamp}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
});

// Bootstrap Scrollspy initialisieren
document.addEventListener('DOMContentLoaded', function() {
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navbar-sections',
        offset: 100
    });
});

// add: reset form button handler
function attachResetButton() {
	const btn = document.getElementById('resetForm');
	if (!btn) return;
	btn.addEventListener('click', function () {
		const confirmed = window.confirm('Formular wirklich zurücksetzen? Alle ungespeicherten Änderungen gehen verloren.');
		if (!confirmed) return;

		const form = document.getElementById('personForm');
		if (!form) return;

		// Clear basic inputs/selects/textareas and uncheck radios/checkboxes
		form.querySelectorAll('input, textarea, select').forEach(el => {
			const tag = el.tagName.toLowerCase();
			const type = el.type;
			if (type === 'checkbox' || type === 'radio') {
				el.checked = false;
			} else if (tag === 'select') {
				try { el.selectedIndex = -1; } catch(e) { el.value = ''; }
			} else {
				el.value = '';
			}
			el.removeAttribute('disabled');
			el.classList.remove('is-invalid');
		});

		// Remove dynamic rows / containers
		['namensvarianten-container','taetigkeiten-container','wirkungsorte-container','datum-ohne-kontext-container'].forEach(id => {
			const c = document.getElementById(id);
			if (c) c.innerHTML = '';
		});

		// Reset Anzeige-Namen UI
		const anzeigeNameDisplay = document.getElementById('anzeigeNameDisplay');
		const anzeigeNameDates = document.getElementById('anzeigeNameDates');
		if (anzeigeNameDisplay) anzeigeNameDisplay.textContent = '—';
		if (anzeigeNameDates) anzeigeNameDates.textContent = '—';

		// Ensure gates update: dispatch change events for role/status/consent so listeners re-evaluate
		document.querySelectorAll('input[name="userrolle"]').forEach(r => r.dispatchEvent(new Event('change', { bubbles: true })));
		document.querySelectorAll('input[name="lebensstatus"]').forEach(r => r.dispatchEvent(new Event('change', { bubbles: true })));
		const consent = document.getElementById('einwilligung');
		if (consent) consent.dispatchEvent(new Event('change', { bubbles: true }));

		// Re-init autocomplete bindings for any empty inputs still present
		document.querySelectorAll('.autocomplete-input').forEach(input => {
			const dropdown = input.nextElementSibling;
			const key = input.dataset.autocomplete;
			if (key && dropdown && dropdown.classList.contains('autocomplete-dropdown')) {
				// re-init only if dropdown empty
				if (!dropdown.children.length) initAutocomplete(input, dropdown, key);
			}
		});
	});
}

document.addEventListener('DOMContentLoaded', function(){
	// JSON controls init
	// Kontakt consent init
	// ...
	// attach reset button
	attachResetButton();
});
