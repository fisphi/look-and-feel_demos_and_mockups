// User-Rolle Gate-Logik
(function() {
    const userRolleRadios = document.querySelectorAll('input[name="userrolle"]');
    const allSections = document.querySelectorAll('.form-section');
    const navLinkMap = new Map();
    document.querySelectorAll('#navbar-sections .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        navLinkMap.set(href.slice(1), link);
    });

    function setNavVisibility(sectionId, visible) {
        const link = navLinkMap.get(sectionId);
        if (!link) return;
        if (visible) {
            link.classList.remove('d-none');
            link.removeAttribute('aria-hidden');
            link.removeAttribute('tabindex');
        } else {
            link.classList.add('d-none');
            link.setAttribute('aria-hidden', 'true');
            link.setAttribute('tabindex', '-1');
        }
    }

    const viewerVisibleSections = new Set(['anzeigename', 'meta']);
    const viewerLivingSections = new Set(['identitaet', 'quellenangaben']);
    const viewerAllowedIdentityFields = new Set(['vorname', 'nachname']);
    const viewerWriteTargets = [
        '#meta [data-bs-target="#commentModal"]',
        '#meta [data-bs-target="#newNoteModal"]',
        '#quellenangaben [data-bs-target="#sourceModal"]'
    ].join(',');

    function setViewerDisabled(control, disabled) {
        if (disabled) {
            if (!control.hasAttribute('data-viewer-was-disabled')) {
                control.setAttribute('data-viewer-was-disabled', control.disabled ? 'true' : 'false');
            }
            control.disabled = true;
            return;
        }
        if (control.hasAttribute('data-viewer-was-disabled')) {
            control.disabled = control.getAttribute('data-viewer-was-disabled') === 'true';
            control.removeAttribute('data-viewer-was-disabled');
        }
    }

    function setViewerSectionState(section, visible) {
        section.classList.toggle('d-none', !visible);
        section.toggleAttribute('hidden', !visible);
        if ('inert' in section) section.inert = !visible;
        section.querySelectorAll('input, select, textarea, button').forEach(control => {
            setViewerDisabled(control, true);
        });
        setNavVisibility(section.id, visible);
    }

    function restoreViewerState() {
        allSections.forEach(section => {
            section.removeAttribute('hidden');
            if ('inert' in section) section.inert = false;
            section.querySelectorAll('[data-viewer-was-disabled]').forEach(control => {
                setViewerDisabled(control, false);
            });
        });
        document.querySelectorAll('[data-viewer-hidden]').forEach(element => {
            element.classList.remove('d-none');
            element.removeAttribute('hidden');
            element.removeAttribute('data-viewer-hidden');
        });
        document.querySelectorAll('[data-viewer-action-hidden]').forEach(element => {
            element.classList.remove('d-none');
            element.removeAttribute('hidden');
            element.removeAttribute('data-viewer-action-hidden');
        });
        document.querySelectorAll('[data-viewer-was-disabled]').forEach(control => {
            setViewerDisabled(control, false);
        });
        ['commentModal', 'newNoteModal', 'sourceModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) modal.removeAttribute('inert');
        });
    }

    function applyViewerPermissions() {
        const living = document.querySelector('input[name="lebensstatus"]:checked')?.value === 'lebend';

        allSections.forEach(section => {
            if (section.id === 'userrolle') return;
            const visible = viewerVisibleSections.has(section.id)
                || (living && viewerLivingSections.has(section.id));
            setViewerSectionState(section, visible);
        });

        const identity = document.getElementById('identitaet');
        if (identity && living) {
            identity.querySelectorAll('.card-body > .row > [class*="col-"]').forEach(fieldGroup => {
                const input = fieldGroup.querySelector('input, select, textarea');
                const allowed = input && viewerAllowedIdentityFields.has(input.id);
                if (!allowed) {
                    fieldGroup.classList.add('d-none');
                    fieldGroup.hidden = true;
                    fieldGroup.setAttribute('data-viewer-hidden', 'true');
                }
            });
        }

        document.querySelectorAll(viewerWriteTargets).forEach(action => {
            action.classList.add('d-none');
            action.hidden = true;
            action.setAttribute('data-viewer-action-hidden', 'true');
            setViewerDisabled(action, true);
        });
        ['commentModal', 'newNoteModal', 'sourceModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) modal.setAttribute('inert', '');
        });

        document.querySelectorAll('.sidebar-actions').forEach(actions => {
            actions.querySelectorAll('#resetForm, #exportJson').forEach(action => {
                action.classList.add('d-none');
                action.hidden = true;
                action.setAttribute('data-viewer-action-hidden', 'true');
                setViewerDisabled(action, true);
            });
        });
        document.dispatchEvent(new Event('person-role-changed'));
    }
    
    function updateRolePermissions() {
        const selectedRole = document.querySelector('input[name="userrolle"]:checked');

        restoreViewerState();
        
        if (!selectedRole) {
            // Keine Rolle gewählt - alle Sektionen außer User-Rolle deaktivieren
            allSections.forEach(section => {
                if (section.id !== 'userrolle') {
                    section.classList.remove('d-none');
                    section.classList.add('disabled-section');
                    setNavVisibility(section.id, true);
                }
            });
            return;
        }
        
        const role = selectedRole.value;

        // Record-Viewer: ausschließlich explizit freigegebene Daten, immer read-only.
        if (role === 'user') {
            applyViewerPermissions();
            return;
        }
        
        // Für andere Rollen: alle Navigationspunkte sichtbar
        allSections.forEach(section => setNavVisibility(section.id, true));
        
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

        // anderen Komponenten mitteilen, dass Rolle gewechselt hat
        document.dispatchEvent(new Event('person-role-changed'));
    }
    
    // Event-Listener für User-Rolle
    userRolleRadios.forEach(radio => {
        radio.addEventListener('change', updateRolePermissions);
    });
    document.querySelectorAll('input[name="lebensstatus"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.querySelector('input[name="userrolle"]:checked')?.value === 'user') {
                // Nach den allgemeinen Lebensstatus-Gates erneut als letzte,
                // restriktivste Berechtigungsschicht anwenden.
                queueMicrotask(() => {
                    restoreViewerState();
                    applyViewerPermissions();
                });
            }
        });
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

    const anzeigeNameDisplay = document.getElementById('anzeigeNameDisplay');
    const anzeigeNameDates = document.getElementById('anzeigeNameDates');
    const sidebarAnzeigename = document.getElementById('sidebarAnzeigename');
    const sidebarAnzeigenameMeta = document.getElementById('sidebarAnzeigenameMeta');
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
                const url = isUrl ? trimmedValue : 'https://orcid.org/${encodeURIComponent(orcidId)}';
                return '[ORCID: <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${safeId}</a>]';
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
        const wirkungszeitraum = (document.querySelector('input[name="zeitraum[]"]')?.value || '').trim();

        const datePieces = [];
        if (geb) datePieces.push('[* ' + geb + ']');
        if (sterb) datePieces.push('[† ' + sterb + ']');
        if (wirkungszeitraum) datePieces.push('[fl. ' + wirkungszeitraum + ']');
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
        if (sidebarAnzeigename) {
            sidebarAnzeigename.textContent = displayNameBase;
        }

        const metaParts = [];
        if (datePieces.length) {
            metaParts.push(datePieces.map(escapeHtml).join(' · '));
        }
        metaParts.push(escapeHtml(collectionSuffix.trim()));
        if (normdatenSuffixes.length) {
            metaParts.push(...normdatenSuffixes);
        }
        const metaHtml = metaParts.join(' · ');
        anzeigeNameDates.innerHTML = metaHtml;
        if (sidebarAnzeigenameMeta) {
            sidebarAnzeigenameMeta.innerHTML = metaHtml;
        }
    }

    // attach listeners if elements exist
    [
        vornameInput,
        mittelnameInput,
        nachnameInput,
        geburtsInput,
        sterbeInput,
        ...normdatenFields.map(field => document.getElementById(field.id)).filter(Boolean)
    ].forEach(el => {
        if (el) el.addEventListener('input', updateAnzeigename);
    });

    // initial
    updateAnzeigename();
})();

// Tätigkeiten / Rollen - Repeatable Section
(function() {
    const existingEntries = document.querySelectorAll('.taetigkeiten-entry');
    let taetigkeitenCounter = existingEntries.length || 1;
    
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
    
    const addTaetigkeitButton = document.getElementById('addTaetigkeitBtn');
    if (addTaetigkeitButton) {
        addTaetigkeitButton.addEventListener('click', function() {
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
                    <label class="form-label">Bezeichnung der Tätigkeit</label>
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
                <div class="col-12">
                    <div data-edtf-interval></div>
                    <input type="hidden" name="zeitraum[]">
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
            document.dispatchEvent(new CustomEvent('edtf-entry-added', { detail: entry }));
            
            // Initialize autocomplete for institution field
            const institutionInput = entry.querySelector('[data-autocomplete="institutionen"]');
            const institutionDropdown = institutionInput.nextElementSibling;
            initAutocomplete(institutionInput, institutionDropdown, 'institutionen');
            
            // Add initial role field
            addRolleToEntry(entry.querySelector('.btn-outline-primary'), taetigkeitenCounter);
        });
    }
    
    // Initialize autocomplete for pre-filled entry
    existingEntries.forEach((entry) => {
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

// Wirkungsorte – dynamische Karten
(function() {
    const container = document.getElementById('wirkungsorte-container');
    const addButton = document.getElementById('addWirkungsortBtn');
    if (!container || !addButton) return;

    let wirkungsortCounter = 0;

    function createWirkungsortCard(initial = {}) {
        const entryId = `wirkungsort-${++wirkungsortCounter}`;
        const card = document.createElement('div');
        card.className = 'wirkungsort-item card shadow-sm mb-3';
        card.dataset.wirkungsortId = entryId;
        card.innerHTML = `
            <div class="card-body">
                <div class="row g-2 align-items-end">
                    <div class="col-12 col-lg">
                        <label class="form-label small mb-1">Wirkungsort</label>
                        <div class="autocomplete-wrapper">
                            <input type="text" class="form-control autocomplete-input" name="wirkungsorte[]" placeholder="Ort / Region" data-autocomplete="wirkungsorte">
                            <div class="autocomplete-dropdown"></div>
                        </div>
                    </div>
                    <div class="col-auto ms-auto">
                        <button type="button" class="btn btn-outline-danger btn-sm remove-wirkungsort" aria-label="Wirkungsort entfernen">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-3" data-edtf-wirkungsort-interval></div>
                <input type="hidden" name="wirkungsorte_von[]">
                <input type="hidden" name="wirkungsorte_bis[]">
                <input type="hidden" name="wirkungsorte_zeitraum[]">
                <div class="row g-2 mt-2">
                    <div class="col-12 col-md-6">
                        <label class="form-label small mb-1">Institution</label>
                        <input type="text" class="form-control" name="wirkungsorte_institution[]" placeholder="Institution / Einrichtung">
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label small mb-1">Rolle / Funktion</label>
                        <input type="text" class="form-control" name="wirkungsorte_rolle[]" placeholder="z.B. Expeditionsleiter">
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12">
                        <label class="form-label small mb-1">Beschreibung / Kontext</label>
                        <textarea class="form-control" name="wirkungsorte_beschreibung[]" rows="2" placeholder="Kurzbeschreibung zum Wirkungsort"></textarea>
                    </div>
                </div>
            </div>
        `;

        card.querySelector('input[name="wirkungsorte[]"]').value = initial.ort || '';
        card.querySelector('input[name="wirkungsorte_von[]"]').value = initial.von || '';
        card.querySelector('input[name="wirkungsorte_bis[]"]').value = initial.bis || '';
        card.querySelector('input[name="wirkungsorte_zeitraum[]"]').value = initial.zeitraum || '';
        card.querySelector('input[name="wirkungsorte_institution[]"]').value = initial.institution || '';
        card.querySelector('input[name="wirkungsorte_rolle[]"]').value = initial.rolle || '';
        card.querySelector('textarea[name="wirkungsorte_beschreibung[]"]').value = initial.beschreibung || '';

        const ortInput = card.querySelector('.autocomplete-input');
        const dropdown = card.querySelector('.autocomplete-dropdown');
        if (ortInput && dropdown) {
            initAutocomplete(ortInput, dropdown, 'wirkungsorte');
        }

        const removeBtn = card.querySelector('.remove-wirkungsort');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => card.remove());
        }

        return card;
    }

    addButton.addEventListener('click', () => {
        const card = createWirkungsortCard();
        container.appendChild(card);
        document.dispatchEvent(new CustomEvent('edtf-wirkungsort-added', {
            detail: card.querySelector('[data-edtf-wirkungsort-interval]')
        }));
    });
})();

// Gate-Logik für Lebensstatus
(function() {
    const lebensstatusRadios = document.querySelectorAll('input[name="lebensstatus"]');
    const sections = document.querySelectorAll('.form-section.disabled-section');
    const einwilligungCheckbox = document.getElementById('einwilligung');
    const kontaktFields = document.getElementById('kontakt-fields');
    const kontaktFieldIds = ['email', 'telefon', 'mobil', 'fax', 'adresse_roh'];
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
        
        // Sterbedaten-Logik. Der Wert wird niemals stillschweigend gelöscht;
        // Bestätigung und Bereinigung übernimmt die EDTF-Komponente.
        if (status === 'lebend') {
            sterbedatum.disabled = true;
            sterbeort.disabled = true;
        } else {
            sterbedatum.disabled = false;
            sterbeort.disabled = false;
        }
        
        // Kontakt-Logik
        updateKontaktFields();
    }
    
    function updateKontaktFields() {
        const selectedRole = document.querySelector('input[name="userrolle"]:checked');
        const role = selectedRole ? selectedRole.value : null;
        const einwilligung = !!(einwilligungCheckbox && einwilligungCheckbox.checked);
        
        if (!kontaktFields) return;

        const kontaktInputs = kontaktFieldIds
            .map(id => document.getElementById(id))
            .filter(Boolean);

        const disableKontakt = !einwilligung || !(role === 'kurator' || role === 'kustode');

        kontaktInputs.forEach(input => {
            input.disabled = disableKontakt;
        });
    }
    
    // Event-Listener
    lebensstatusRadios.forEach(radio => {
        radio.addEventListener('change', updateFormState);
    });
    
    if (einwilligungCheckbox) {
        einwilligungCheckbox.addEventListener('change', updateKontaktFields);
    }
    
    document.addEventListener('person-role-changed', updateKontaktFields);
    
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
        }
    };
    
    function createDynamicField(config, index) {
        const row = document.createElement('div');
        row.className = 'dynamic-field-row';
        row.dataset.index = index;
        
        if (config.autocomplete) {
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
    
    // Initial je ein Feld hinzufügen (außer bereits vorgefüllten Typen)
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

// Highlight inputs/selects with values
(function() {
    const selector = '.form-control, .form-select';

    function updateHighlight(el) {
        if (!el || !el.matches(selector)) return;
        const value = (el.value || '').trim();
        el.classList.toggle('has-value', value.length > 0);
    }

    function initValueHighlights() {
        document.querySelectorAll(selector).forEach(updateHighlight);
        document.addEventListener('input', (event) => updateHighlight(event.target), true);
        document.addEventListener('change', (event) => updateHighlight(event.target), true);
    }

    document.addEventListener('DOMContentLoaded', initValueHighlights);
})();

// JSON-Modell und Export
function collectPersonFormData() {
    const formData = {};
    const form = document.getElementById('personForm');
    
    // Einfache Felder
    const inputs = form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([name*="[]"]), textarea, select');
    inputs.forEach(input => {
        if (input.disabled || !input.name) return;
        const rawValue = input.value;
        if (!rawValue) return;

        if (input.name === 'import_quelldaten') {
            const trimmed = rawValue.trim();
            if (!trimmed) return;
            try {
                formData[input.name] = JSON.parse(trimmed);
            } catch (error) {
                formData[input.name] = trimmed;
            }
            return;
        }

        formData[input.name] = rawValue;
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
        wirkungsorte: [],
        wirkungsorte_von: [],
        wirkungsorte_bis: [],
        wirkungsorte_zeitraum: [],
        wirkungsorte_institution: [],
        wirkungsorte_rolle: [],
        wirkungsorte_beschreibung: [],
        zeitraum: [],
        datum_ohne_kontext: []
    };
    
    Object.keys(dynamicFields).forEach(fieldName => {
        const inputs = form.querySelectorAll(`input[name="${fieldName}[]"], textarea[name="${fieldName}[]"]`);
        inputs.forEach(input => {
            if (!input.disabled && input.value.trim()) {
                dynamicFields[fieldName].push(input.value.trim());
            }
        });
        if (dynamicFields[fieldName].length > 0) {
            formData[fieldName] = dynamicFields[fieldName];
        }
    });

    return formData;
}

window.collectPersonFormData = collectPersonFormData;

document.getElementById('exportJson').addEventListener('click', function() {
    if (document.querySelector('input[name="userrolle"]:checked')?.value === 'user') return;
    if (!validateForm()) {
        alert('Bitte korrigieren Sie die Fehler im Formular.');
        return;
    }

    const formData = collectPersonFormData();
    
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
		if (document.querySelector('input[name="userrolle"]:checked')?.value === 'user') return;
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
		['namensvarianten-container','taetigkeiten-container','wirkungsorte-container'].forEach(id => {
			const c = document.getElementById(id);
			if (c) c.innerHTML = '';
		});
		window.EDTFForm?.resetDateLists?.();

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
