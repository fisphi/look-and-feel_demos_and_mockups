# Regressionstest-Checkliste – Personenformular

## Baseline

| Merkmal | Wert |
| --- | --- |
| Getesteter Commit | `86f3b40` (`docs(person-form): add UI inventory, design system, and migration plan`) |
| Testdatum | 31. Juli 2026 |
| Geltungsbereich | `docs/person-form-lookfeel` |
| Testart | Manuelle Regression, Quellcodeprüfung und Chromium-Smoke-Test |
| Phase | 0 – Testbasis schaffen; keine Produktlogik ändern |

Diese Checkliste beschreibt den aktuellen Ist-Zustand. Ein als fehlgeschlagen
markierter Fall ist ein Baseline-Befund und **kein** Auftrag zur Behebung in
Phase 0.

## Voraussetzungen und Start

1. Im Verzeichnis `docs/person-form-lookfeel` arbeiten.
2. Netzwerkzugriff auf jsDelivr zulassen: Bootstrap 5.3.2, Bootstrap Icons und
   `edtf@4.11.0` werden extern geladen.
3. Einen lokalen HTTP-Server starten. Das direkte Öffnen über `file:` ist für
   das dynamisch importierte EDTF-Modul nicht geeignet.

   ```sh
   python3 -m http.server 8765 --bind 127.0.0.1
   ```

4. Im aktuellen Evergreen-Browser `http://127.0.0.1:8765/index.html` öffnen.
5. Browserkonsole öffnen, Cache deaktivieren und für jeden Testfall die Seite
   neu laden, sofern keine abweichende Vorbedingung genannt ist.

### Ausgangsdaten

- Rolle: **DB-Owner** (`kurator`), beim Neuladen ausgewählt.
- Lebensstatus: **verstorben**.
- Anzeigename: Demo-Person mit Vorname `Ferdinand` und Nachname `Hochstetter`.
- Geburtsdatum: `1829-04-30`; Sterbedatum: `1884-07-18`.
- Für EDTF-Einträge: `1874`, `1874-03`, `1874-03-12`, `1874-03-XX`, `187X`,
  `18XX`, `1874?`, `1874~`, `1874%`, `1901/1918`, `1995/..`, `1995/`,
  `/1918`, `2000-02-29`, `1900-02-29` und `2026-13`.
- Für lange Inhalte: einen Ortsnamen mit mindestens 100 Zeichen und eine
  EDTF-Interpretation mit Jahrhundert/Qualifier verwenden.

## Statuswerte

- **Bestanden**: Ergebnis entspricht dem dokumentierten Ist-Zustand.
- **Fehlgeschlagen**: reproduzierbare Abweichung; als Baseline-Befund erfassen.
- **Blockiert**: wegen externer Voraussetzung nicht ausführbar.
- **Nicht getestet**: in diesem Lauf noch offen; vor einer betroffenen Migration
  nachholen.

## Kompakte Abdeckungsmatrix

| Bereich | Fälle | Im Baseline-Lauf | Offene manuelle Fälle |
| --- | ---: | ---: | ---: |
| Umgebung und Ausgangszustand | ENV-01–03 | 2 | 1 |
| Rollen und Viewer | ROLE-01–05, VIEW-01–06 | 10 | 1 |
| Rollen- und Lebensstatuswechsel | STATE-01–05 | 1 | 4 |
| EDTF | EDTF-01–10 | 4 | 6 |
| Dynamische Listen | LIST-01–08 | 0 | 8 |
| Validierung | VAL-01–08 | 2 | 6 |
| Export und Reset | DATA-01–07 | 3 | 4 |
| Theme und Darstellung | THEME-01–05 | 2 | 3 |
| Tastatur und Fokus | KEY-01–08 | 2 | 6 |
| Responsive und Abhängigkeiten | RESP-01–07 | 4 | 3 |

## Testfälle

### Umgebung und Ausgangszustand

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| ENV-01 | Lokaler HTTP-Server läuft. | 1. Seite laden. 2. Konsole prüfen. 3. `window.EDTFForm` prüfen. | Bootstrap und EDTF-Komponente laden; keine Anwendungsausnahme. | Chromium-Smoke: `window.EDTFForm` vorhanden, keine `window.error`-Meldung. | Bestanden |
| ENV-02 | Frische Seite. | 1. Rollenradio prüfen. 2. Lebensstatus und Beispieldaten prüfen. | DB-Owner und „verstorben“ sind ausgewählt; Demo-Daten sind sichtbar. | Im Quelltext und Smoke bestätigt. | Bestanden |
| ENV-03 | Netzwerk gezielt blockierbar. | 1. jsDelivr für EDTF blockieren. 2. Seite laden. | EDTF-Hosts zeigen die dokumentierte Fehlermeldung; übrige Abhängigkeiten und Ausfallwirkung werden protokolliert. | Noch nicht mit Netzwerkblockade ausgeführt. | Nicht getestet |

### Rollen

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| ROLE-01 | Neu geladen, DB-Owner. | 1. Sichtbare Abschnittslinks zählen. 2. Bearbeitungs- und Sidebar-Aktionen prüfen. 3. Export und Reset auslösen, Dialog/Download ggf. abbrechen. | Alle 13 Abschnitte und Aktionen sind verfügbar. | Smoke: alle 13 Abschnitte sichtbar; Export/Reset sichtbar. | Bestanden |
| ROLE-02 | Neu geladen. | 1. Record-Owner wählen. 2. Lebensstatus, Identität, Export und Reset prüfen. 3. Zu DB-Owner zurückwechseln. | Tatsächliche bestehende Zustände bleiben über den Wechsel konsistent. | Smoke: alle Abschnitte und Aktionen aktiv. Hinweis: Text der Rollenoption nennt Lebensstatus/Identität schreibgeschützt, die aktuelle Restriktionslogik deaktiviert sie jedoch nicht. | Fehlgeschlagen |
| ROLE-03 | Neu geladen. | 1. Record-Editor wählen. 2. Lebensstatus, Identität und Kontakt bedienen. 3. Übrige Abschnitte bedienen. | Lebensstatus, Identität und Kontakt sind deaktiviert; übrige Bereiche verfügbar. | Smoke: genau diese drei Abschnitte `disabled-section`; Export/Reset sichtbar. | Bestanden |
| ROLE-04 | Neu geladen. | 1. Record-Viewer wählen. 2. Sidebar, globale Aktionen und Abschnittslinks prüfen. 3. Vorherige Rolle wiederherstellen. | Nur freigegebene Viewer-Bereiche; Reset und Export verborgen/deaktiviert; keine veralteten Controls. | Smoke: Reset/Export verborgen; Sichtbarkeit gemäß VIEW-01/02. | Bestanden |
| ROLE-05 | Jede Rolle nacheinander gewählt. | 1. Nach jedem Wechsel Tabulator drücken. 2. Deaktivierte/verborgene Bereiche prüfen. | Verborgene Controls sind nicht fokussierbar; disabled Controls können nicht schreiben. | Nur Viewer- und EDTF-Aktionen automatisiert geprüft. Vollständiger Tab-Lauf offen. | Nicht getestet |

### Record-Viewer

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| VIEW-01 | Lebensstatus „verstorben“. | 1. Record-Viewer wählen. 2. Sichtbare Hauptabschnitte und Navigation notieren. | Nur Rollenwahl, Anzeigename und vorhandene Anmerkungen/Kommentare sichtbar. | Smoke: `userrolle`, `anzeigename`, `meta`; Kommentar-Trigger verborgen. | Bestanden |
| VIEW-02 | Lebensstatus „lebend“. | 1. Record-Viewer wählen. 2. Identität und Quellen öffnen. 3. Sichtbare Identitätsfelder notieren. | Zusätzlich Vorname, Nachname und Quellen; sonst keine zusätzlichen Personendaten. | Smoke: `identitaet` und `quellenangaben` sichtbar; nur `vorname`, `nachname` in Identität sichtbar. | Bestanden |
| VIEW-03 | Viewer, beide Lebensstatus getrennt. | 1. Kommentar-/Notiz-/Quellen-Trigger prüfen. 2. Tastaturaktivierung versuchen. 3. Modale im DOM prüfen. | Keine Schreibaktion erreichbar; relevante Modale sind inert. | Smoke: Kommentar-Trigger verborgen, Meta-Controls nicht aktiviert. | Bestanden |
| VIEW-04 | Viewer. | 1. Record History, Import und technische Metadaten über UI und Sidebar suchen. 2. Export/Reset/Speichern auslösen. | Bereiche und Aktionen nicht sichtbar bzw. nicht ausführbar. | Smoke: History/Import nicht sichtbar; Export/Reset verborgen. Speichern manuell offen prüfen. | Bestanden |
| VIEW-05 | Viewer mit absichtlich leerem Nachnamen oder anderen Pflichtwerten. | 1. Export/Save-ähnliche Aktion anstoßen. 2. `validateForm()` in Konsole prüfen. | Keine Pflichtprüfung verborgener oder nicht bearbeitbarer Felder. | Quellcode: `validateForm()` gibt für `user` unmittelbar `true` zurück. | Bestanden |
| VIEW-06 | Viewer. | 1. DevTools öffnen. 2. Verborgene DOM-Elemente und `collectPersonFormData` untersuchen. | Baseline dokumentiert, dass dies keine Zugriffskontrolle ist. | **Sicherheitsbefund:** Sperren sind ausschließlich clientseitig; DOM und JavaScript bleiben lokal zugänglich. Produktion muss Abruf, Speicherung und Export serverseitig autorisieren. | Bestanden |

### Rollen- und Lebensstatuswechsel

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| STATE-01 | DB-Owner, verstorben mit Sterbedatum. | 1. „lebend“ wählen. 2. Bestätigungsdialog einmal abbrechen, einmal bestätigen. | Abbruch stellt Status wieder her; Bestätigung löscht Sterbedatum bewusst und deaktiviert Todesfelder. | Funktion im Quellpfad dokumentiert; vollständiger Dialoglauf offen. | Nicht getestet |
| STATE-02 | DB-Owner, lebend. | 1. „verstorben“ wählen. 2. Sterbedatum und Sterbeort bedienen. | Todesfelder werden wieder verfügbar. | Durch `syncDeathAvailability` und Lebensstatus-Gate vorhanden; manuell offen. | Nicht getestet |
| STATE-03 | Viewer, verstorben. | 1. Auf lebend wechseln. 2. Sichtbarkeit prüfen. 3. Wieder verstorben wählen. | Identität/Quellen erscheinen nur bei lebend und verschwinden wieder vollständig. | Smoke bestätigt verstorben und lebend; Rückwechsel noch manuell offen. | Nicht getestet |
| STATE-04 | Alle vier Rollen. | 1. Jede Kombination aus Rolle und Lebensstatus wechseln. 2. Mehrfach hin- und herwechseln. | Keine alten Sichtbarkeits-, Disabled- oder Aktionszustände. | Smoke prüfte einmalige Wechsel Owner → Viewer → Owner. | Bestanden |
| STATE-05 | Record-Editor. | 1. Lebensstatus wählen. 2. Wechsel zu Owner und zurück. | Rollenrestriktionen bleiben nach Statuswechsel wirksam. | Noch nicht als Kombination geprüft. | Nicht getestet |

### EDTF

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| EDTF-01 | DB-Owner. | 1. Geburtsdatum bearbeiten. 2. Vollständiges Datum `2000-02-29` eingeben. 3. Übernehmen. | Kanonischer Wert und deutsche Interpretation erscheinen. | Parser-Smoke: gültig; UI-Übernahme für dieses Beispiel offen. | Nicht getestet |
| EDTF-02 | DB-Owner. | 1. Je `1874`, `1874-03`, `1874-03-12` über die Maske setzen. 2. Anzeige prüfen. | Jahr, Monat und Datum sind gültig und lesbar interpretiert. | Parser-Smoke: alle gültig. | Bestanden |
| EDTF-03 | DB-Owner. | 1. `1874-03-XX`, `187X`, `18XX` setzen. 2. Anzeige prüfen. | Unbekannte Teile sind gültig; Rohwert und Interpretation stimmen. | Parser-Smoke: alle gültig. | Bestanden |
| EDTF-04 | DB-Owner. | 1. `1874?`, `1874~`, `1874%` setzen. 2. Interpretation prüfen. | Unsicher, ungefähr und kombiniert werden unterstützt. | Parser-Smoke: alle gültig. | Bestanden |
| EDTF-05 | Zeitraum. | 1. `1901/1918`, `1995/..`, `1995/`, `/1918` erzeugen. 2. Endzustandsmodal prüfen. | Geschlossene und offene Intervalle bleiben kanonisch und verständlich. | Parser-Smoke: alle gültig; UI-Endzustände offen. | Nicht getestet |
| EDTF-06 | DB-Owner. | 1. `1900-02-29` und `2026-13` eingeben. 2. Übernehmen versuchen. | Fehlermeldung; Modal bleibt offen; kein ungültiger Wert wird gespeichert. | Parser-Smoke: beide ungültig. Modalverhalten offen. | Bestanden |
| EDTF-07 | Geburt und Tod vorhanden. | 1. Tod vollständig vor Geburt setzen. 2. Validierung auslösen. | Chronologiefehler am Sterbedatum. | Noch nicht interaktiv geprüft. | Nicht getestet |
| EDTF-08 | Weitere Lebensdaten leer. | 1. Datum hinzufügen. 2. `1874` setzen. 3. Zweites Datum hinzufügen. 4. Erstes bearbeiten und eines entfernen. | 0/1/n, Edit, Cancel und Delete sind unabhängig; Fokus kehrt sinnvoll zurück. | Add/Übernahme im Smoke bestanden; Edit/Cancel/Delete vollständig manuell offen. | Nicht getestet |
| EDTF-09 | Viewer mit EDTF-Werten. | 1. Viewer wählen. 2. Hinzufügen- und Stift-Aktionen prüfen. | Keine EDTF-Schreibaktionen sichtbar oder aktiv. | Über zentrale Rollenaktion im bisherigen Browsertest bestätigt; in diesem Lauf nicht erneut ausgeführt. | Nicht getestet |
| EDTF-10 | Nach EDTF-Änderungen. | 1. Reset auslösen. 2. Rollen wechseln. | Definierter Resetzustand ohne doppelte Listener oder Datenreste. | Reset weist Baseline-Defekt auf, siehe DATA-06. | Fehlgeschlagen |

### Dynamische Listen

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| LIST-01 | Weitere Lebensdaten leer. | 1. Leertext prüfen. 2. Hinzufügen drücken. 3. Abbrechen. | Leertext bleibt rein visuell; keine Daten werden exportiert. | Add/Save exportiert kanonisch; Abbruch offen. | Nicht getestet |
| LIST-02 | Tätigkeiten. | 1. Tätigkeit hinzufügen. 2. Zwei Rollen ergänzen. 3. Einzelne Rolle und Tätigkeit entfernen. | Reihenfolge, verbleibende Einträge und EDTF-Initialisierung stimmen. | Nicht getestet |
| LIST-03 | Wirkungsorte. | 1. Ort hinzufügen. 2. Autocomplete wählen. 3. Zeitraum setzen. 4. Entfernen. | Dynamischer Ort erhält Autocomplete, EDTF und zugängliche Aktionen. | Nicht getestet |
| LIST-04 | Quellen. | 1. Quelle über Modal anlegen. 2. Typ wechseln. 3. Abbrechen, speichern und entfernen. | Richtige Felder, keine Reste nach Abbruch. | Nicht getestet |
| LIST-05 | Anmerkungen/Kommentare. | 1. Kommentar und Antwort öffnen. 2. Abbrechen und speichern. 3. Viewer wechseln. | Thread, Aktionen, Rollenblockade und Fokus bleiben konsistent. | Nicht getestet |
| LIST-06 | Namensvarianten. | 1. Mehrere Varianten ergänzen. 2. Entfernen. 3. Tastaturnamen der Papierkorb-Buttons prüfen. | Dynamische Buttons haben verständliche Namen; keine Reihenfolgenfehler. | Inventur-Befund: dynamische Papierkorb-Buttons besitzen teils keinen zugänglichen Namen. | Fehlgeschlagen |
| LIST-07 | Jede dynamische Liste. | 1. Hinzufügen. 2. Fokusposition notieren. 3. Entfernen. 4. Nächsten logischen Fokus prüfen. | Fokus bleibt sichtbar und sinnvoll. | Nicht getestet |
| LIST-08 | Dynamische Einträge vorhanden. | 1. Viewer wählen. 2. Danach Owner wählen. | Einträge bleiben korrekt, Schreibaktionen folgen Rolle. | Nicht getestet |

### Validierung

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| VAL-01 | DB-Owner, leeres Formular. | 1. Reset bestätigen. 2. Export auslösen. | Lebensstatus und Nachname werden als erforderlich gemeldet. | Quellcode: beide Prüfungen vorhanden; Reset-Befund beachten. | Nicht getestet |
| VAL-02 | DB-Owner, gültige Demo-Daten. | 1. Export auslösen. | Keine Validierungsfehler; Download wird erstellt. | Serialisierung im Smoke geprüft, Download nicht beobachtet. | Nicht getestet |
| VAL-03 | DB-Owner. | 1. Jede `data-validate`-Regel mit ungültigem Wert prüfen. 2. Korrigieren. | Feldnahe Fehlermeldung verschwindet nach Korrektur. | Nicht getestet |
| VAL-04 | DB-Owner. | 1. Ungültiges EDTF und ungültiges Intervall setzen. 2. Speichern/Export versuchen. | Live-Region und/oder Feldfehler; keine Übernahme. | Parser-Teil EDTF-06 bestanden; UI offen. | Nicht getestet |
| VAL-05 | Dynamische Pflichtfelder. | 1. Dynamischen Eintrag mit leerem Pflichtwert erzeugen. 2. Validieren. | Fehler am dynamischen Feld, keine falsche Prüfung anderer Felder. | Nicht getestet |
| VAL-06 | Viewer mit leeren Pflichtfeldern. | 1. `validateForm()` ausführen. | Rückgabe `true`; keine Fehler auf verborgenen Feldern. | Quellcodeprüfung und Viewer-Smoke bestätigt. | Bestanden |
| VAL-07 | Fehlende Pflichtwerte. | 1. Export auslösen. 2. Fokus und Scrollposition beobachten. | Fokus bzw. Navigation zum ersten Fehler ist dokumentiert. | Kein Error-Summary/Fokusmanagement im Bestand. | Fehlgeschlagen |
| VAL-08 | Record-Editor. | 1. Deaktivierte Pflichtfelder leer lassen. 2. Export prüfen. | Nur aktive und relevante Felder werden validiert. | Nicht getestet |

### JSON-Export und Reset

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| DATA-01 | DB-Owner, Ausgangsdaten. | 1. Export klicken. 2. Download öffnen. | JSON enthält statische Ausgangsfelder. | `collectPersonFormData()` im Smoke ausführbar; Downloadinhalt offen. | Nicht getestet |
| DATA-02 | DB-Owner. | 1. Feld, EDTF und dynamischen Eintrag ändern. 2. Export öffnen. | Kanonische EDTF-Werte und Arrays vorhanden. | Smoke: `datum_ohne_kontext: ["1874"]`. | Bestanden |
| DATA-03 | Viewer. | 1. Export-/Reset-Button und Tastatur prüfen. 2. Klick erzwingen. | Aktionen sind verborgen/deaktiviert und führen nichts aus. | Smoke: beide verborgen; Eventhandler blockieren Viewer zusätzlich. | Bestanden |
| DATA-04 | DB-Owner. | 1. Quelle, Tätigkeit, Wirkungsort und Liste ändern. 2. Export vergleichen. | Alle dynamischen Werte werden einmal, geordnet und ohne UI-Hilfswerte exportiert. | Nicht getestet |
| DATA-05 | DB-Owner. | 1. Theme wechseln. 2. Neu laden. 3. Reset auslösen. | Theme-Persistenz und Resetverhalten werden separat erfasst. | Smoke: Theme toggelt; Persistenz/Reset noch manuell offen. | Nicht getestet |
| DATA-06 | DB-Owner. | 1. Rolle, Status und dynamisches Datum ändern. 2. Reset bestätigen. 3. Gewählte Rolle, Status, Daten und Listener prüfen. | Definierter Ausgangszustand wird vollständig wiederhergestellt. | **Baseline-Befund:** `attachResetButton()` leert alle Radios und setzt keine Rolle erneut; im Smoke war danach keine Rolle ausgewählt. | Fehlgeschlagen |
| DATA-07 | Nach DATA-06. | 1. Mehrfach Reset ausführen. 2. Dynamischen Eintrag hinzufügen. | Keine doppelten Handler, keine Datenreste. | Nicht getestet |

### Hell- und Dunkelmodus

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| THEME-01 | Seite geladen. | 1. Theme-Button betätigen. 2. `data-bs-theme` prüfen. | Modus wechselt zwischen hell/dunkel. | Chromium-Smoke bestätigt Wechsel. | Bestanden |
| THEME-02 | Beide Modi. | 1. Formfelder, disabled/read-only, Fehler, Lebensstatus, Modale und Leerzustände prüfen. | Text und Zustände ausreichend lesbar; konkrete Probleme dokumentieren. | Nicht getestet |
| THEME-03 | Dunkelmodus. | 1. Neu laden. 2. `localStorage.theme` und Icon prüfen. | Gewählter Modus bleibt erhalten; Icon entspricht Gegenaktion. | Nicht getestet |
| THEME-04 | Beide Modi. | 1. Fokus mit Tastatur auf Button, Input, Link und Modal schließen. | Sichtbarer Fokus mit ausreichendem Kontrast. | Inventur: kein globaler `:focus-visible`-Standard. | Fehlgeschlagen |
| THEME-05 | Forced Colors und Reduced Motion verfügbar. | 1. DevTools-Emulation aktivieren. 2. Kernaktionen prüfen. | Keine unlesbaren Zustände oder unkontrollierte Bewegung. | Nicht getestet |

### Tastatur und Fokus

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| KEY-01 | DB-Owner. | 1. Ab Seitenanfang nur mit Tab/Shift+Tab navigieren. 2. Reihenfolge notieren. | DOM- und Leserichtung stimmen; keine versteckten Ziele. | Nicht getestet |
| KEY-02 | Rollen- und Statusradios. | 1. Mit Pfeiltasten wählen. 2. Wirkung prüfen. | Auswahl und Gates aktualisieren sich. | Nicht getestet |
| KEY-03 | EDTF-Aktion. | 1. Per Tab fokussieren. 2. Enter drücken. 3. Modal bedienen. 4. Escape. | Modal öffnet, Fokus liegt sinnvoll, Escape speichert nicht und Fokus kehrt zurück. | EDTF-Modal-/Fokuslogik vorhanden; vollständiger Tastaturdurchlauf offen. | Nicht getestet |
| KEY-04 | EDTF-Hilfe. | 1. Hilfeicon fokussieren. 2. Enter, Escape und Rückkehr prüfen. | Name/Tooltip, Dialogtitel und Fokus stimmen. | Nicht getestet |
| KEY-05 | Dynamische Liste. | 1. Hinzufügen per Enter. 2. Abbrechen. 3. Entfernen. | Keine Tastaturfalle; Fokus bleibt sinnvoll. | Nicht getestet |
| KEY-06 | Autocomplete. | 1. Feld fokussieren. 2. Pfeile, Enter und Escape nutzen. | Auswahl funktioniert; ARIA-Attribute prüfen. | Inventur: Tastaturpfad vorhanden, aber Combobox-ARIA fehlt. | Fehlgeschlagen |
| KEY-07 | Viewer. | 1. Vollständigen Tab-Lauf durchführen. | Verborgene/gesperrte Bereiche sind nicht erreichbar. | Nicht getestet |
| KEY-08 | Dynamische Icon-Buttons. | 1. Mit Screenreader/Accessibility-Tree Namen prüfen. | Jeder Icon-Button hat eindeutigen Namen. | Inventur-Befund: einzelne dynamische Trash-Buttons ohne Namen. | Fehlgeschlagen |

### Responsive Darstellung und Abhängigkeiten

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| RESP-01 | 1440, 1024, 768, 576 und 375 px. | 1. Lebensdaten, Sidebar und lange Werte prüfen. 2. `documentElement.scrollWidth` vergleichen. | Kein horizontaler Überlauf; keine abgeschnittenen Aktionen. | Frühere Chromium-Prüfung: Lebensdaten passen; globaler Überlauf bei 375 px stammt aus Lebensstatus/Audit-Tabelle. | Fehlgeschlagen |
| RESP-02 | Formularbreite etwa 800 px. | 1. Geburt/Tod und EDTF-Grid prüfen. | Keine gequetschte Zweispaltigkeit. | Containerbreite bleibt unter Query-Schwelle; einspaltig. | Bestanden |
| RESP-03 | Inhaltsbreite über 992 px testbar. | 1. Container Query mittels DevTools prüfen. | Geburt/Tod dürfen zweispaltig werden, weitere Daten volle Breite. | In aktuellem Layout wegen `max-width:800px` nicht erreichbar. | Blockiert |
| RESP-04 | Lange Orte, IDs und EDTF-Interpretationen. | 1. Testdaten einfügen. 2. Bei allen Breiten prüfen. | Lesbarer Umbruch ohne Überlagerung. | Nicht getestet |
| RESP-05 | Netzwerkblockade. | 1. Bootstrap CSS/JS, Icons und EDTF jeweils einzeln blockieren. | Dokumentierte Ausfallwirkung und Fallbacks. | Nicht getestet |
| RESP-06 | Chromium, Firefox, Safari. | 1. Kernfälle ENV-01, ROLE-04, EDTF-02, DATA-02 wiederholen. | Gleichwertiges Ergebnis in freigegebenen Evergreen-Versionen. | Nur Chromium-Smoke ausgeführt. | Blockiert |
| RESP-07 | Aktueller Quellcode. | 1. `node --check` für JavaScript-Dateien ausführen. 2. `git diff --check` ausführen. | Syntaktisch sauber; keine unbeabsichtigten Änderungen. | Vor Anlegen dieser Checkliste durchgeführt. | Bestanden |

## Bekannte Baseline-Befunde und Einschränkungen

1. **Sicherheitsrelevant – clientseitige Rollensteuerung:** Verbergen, `disabled`
   und `inert` sind keine Zugriffskontrolle. Für eine produktive Anwendung müssen
   Feldfreigaben beim Datenabruf, Speichern und Export serverseitig erzwungen
   werden.
2. **RESET-01:** Reset leert alle Radio-Buttons, einschließlich der Rolle, und
   stellt keinen definierten DB-Owner-Ausgangszustand her.
3. **ROLE-02:** Die sichtbare Beschreibung des Record-Owner weicht von der
   aktuellen Deaktivierungslogik ab.
4. **A11Y-01:** Einzelne dynamisch erzeugte Papierkorb-Buttons besitzen keinen
   zugänglichen Namen.
5. **A11Y-02:** Autocomplete besitzt Tastaturlogik, aber noch keine vollständige
   WAI-ARIA-Combobox-Semantik.
6. **A11Y-03:** Ein globaler konsistenter `:focus-visible`-Standard fehlt.
7. **RESP-01:** Bei 375 px besteht ein globaler horizontaler Überlauf außerhalb
   des Lebensdatenbereichs (Lebensstatus/Audit-Tabelle).
8. **Abhängigkeiten:** Ohne CDN-Zugriff stehen Bootstrap, Icons und EDTF nicht
   vollständig zur Verfügung. Die Anwendung besitzt keinen Build- oder lokalen
   Asset-Fallback.
9. **Automatisierung:** Es gibt keine bestehende Paket- oder Testinfrastruktur.
   Diese Checkliste ist daher die reproduzierbare Phase-0-Basis; ein neues
   umfangreiches Testframework ist nicht Teil dieser Phase.

## Nächste Prüfung vor einer Migration

Vor einer Änderung an Rollen, EDTF, dynamischen Listen, Validierung, Reset,
Theme oder responsivem Layout müssen mindestens alle Fälle des jeweils
betroffenen Abschnitts erneut ausgeführt werden. Für Phase 1 ist die Testbasis
geeignet, sofern die als fehlgeschlagen oder nicht getestet markierten Fälle als
bekannte Baseline-Risiken übernommen und nicht versehentlich als neue Fehler
bewertet werden.
