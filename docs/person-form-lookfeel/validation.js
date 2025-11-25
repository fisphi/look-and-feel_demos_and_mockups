// Validierungs-Regeln und Regex-Patterns
const validationRules = {
    edtf: /^\d{4}(-\d{2}(-\d{2})?)?$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefon: /^[\d\s\+\-\(\)]+$/,
    url: /^https?:\/\/.+/,
    orcid: /^(\d{4}-\d{4}-\d{4}-\d{3}[0-9X]|https?:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[0-9X])$/,
    viaf: /^(\d+|https?:\/\/viaf\.org\/viaf\/\d+)$/,
    gnd: /^(\d+|https?:\/\/d-nb\.info\/gnd\/\d+)$/,
    wikidata: /^Q\d+$/,
    isni: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
    lcnaf: /^n\d+$/,
    bnf: /^cb\d+$/,
    bhl: /^(\d+|https?:\/\/.+)$/,
    zoobank: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    ulan: /^(\d+|https?:\/\/.+)$/
};

// Validierungs-Nachrichten
const validationMessages = {
    edtf: 'Ungültiges EDTF-Format. Verwenden Sie YYYY, YYYY-MM oder YYYY-MM-DD',
    email: 'Ungültige E-Mail-Adresse',
    telefon: 'Ungültige Telefonnummer. Nur Ziffern, +, -, (, ) und Leerzeichen erlaubt',
    url: 'Ungültige URL. Muss mit http:// oder https:// beginnen',
    orcid: 'Ungültiges ORCID-Format',
    viaf: 'Ungültiges VIAF-Format',
    gnd: 'Ungültiges GND-Format',
    wikidata: 'Ungültiges Wikidata-Format. Muss mit Q beginnen, gefolgt von Ziffern',
    isni: 'Ungültiges ISNI-Format. 16 Ziffern erforderlich',
    lcnaf: 'Ungültiges LCNAF-Format. Muss mit n beginnen, gefolgt von Ziffern',
    bnf: 'Ungültiges BNF-Format. Muss mit cb beginnen, gefolgt von Ziffern',
    bhl: 'Ungültiges BHL-Format',
    zoobank: 'Ungültiges ZooBank-Format. UUID erforderlich',
    ulan: 'Ungültiges ULAN-Format'
};

// Validierungs-Funktion
function validateField(input) {
    const validationType = input.dataset.validate;
    if (!validationType) return true;

    const value = input.value.trim();
    if (!value) {
        input.classList.remove('is-invalid');
        return true;
    }

    const pattern = validationRules[validationType];
    const isValid = pattern.test(value);

    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        // Tooltip erstellen/aktualisieren
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = validationMessages[validationType];
        }
    }

    return isValid;
}

// Event-Listener für Live-Validierung
document.addEventListener('DOMContentLoaded', function() {
    const validatableInputs = document.querySelectorAll('[data-validate]');
    
    validatableInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
});

// Formular-Validierung
function validateForm() {
    let isValid = true;
    
    // Lebensstatus prüfen
    const lebensstatusChecked = document.querySelector('input[name="lebensstatus"]:checked');
    if (!lebensstatusChecked) {
        isValid = false;
        alert('Bitte wählen Sie einen Lebensstatus aus.');
        return false;
    }
    
    // Nachname prüfen
    const nachname = document.getElementById('nachname');
    if (!nachname.value.trim()) {
        nachname.classList.add('is-invalid');
        isValid = false;
    }
    
    // Alle Felder mit Validierung prüfen
    const validatableInputs = document.querySelectorAll('[data-validate]');
    validatableInputs.forEach(input => {
        if (!input.disabled && input.value.trim()) {
            if (!validateField(input)) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}
