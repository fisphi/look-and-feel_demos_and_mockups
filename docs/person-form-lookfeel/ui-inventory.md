# Inventur des bestehenden UI-, CSS- und Interaktionssystems

Analysierter Stand: Commit [`eb4544a`](https://github.com/fisphi/look-and-feel_demos_and_mockups/tree/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel) (`refactor(person-form): establish reusable life data UI patterns`)

Demo: [fisphi.github.io/look-and-feel_demos_and_mockups/person-form-lookfeel](https://fisphi.github.io/look-and-feel_demos_and_mockups/person-form-lookfeel/)

## Zweck und Abgrenzung

Dieses Dokument beschreibt den nachweisbaren Ist-Zustand der statischen Personenformular-Demo unter `docs/person-form-lookfeel` am genannten Commit. Es inventarisiert:

- HTML-Struktur und Formularhierarchie;
- vorhandene Komponenten und Varianten;
- Bootstrap-Nutzung und -Abhängigkeiten;
- eigene CSS-Regeln, Tokens, Zustände und responsive Logik;
- JavaScript-Interaktionen und dynamisch erzeugtes Markup;
- Rollen-, Sichtbarkeits- und Validierungslogik;
- Accessibility-Befunde;
- belegte Defekte, Inkonsistenzen und technische Schulden.

Das Dokument definiert **keinen Zielzustand**. Künftige Komponentenregeln gehören in `design-system.md`; Ablösungen, Prioritäten und Arbeitspakete in `migration-plan.md`.

## Analysierte Dateien

| Datei                                                                                                                                                                            |       Umfang | Funktion im Bestand                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------: | ----------------------------------------------------------------------------------------------- |
| [`index.html`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/index.html)                     | 2.503 Zeilen | Seitenaufbau, statisches Formular, Beispieldaten, Modale, Sidebar und fünf Inline-Skripte       |
| [`styles.css`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/styles.css)                     |   701 Zeilen | Bootstrap-Overrides, Theme, Komponenten- und Zustandsregeln                                     |
| [`form.js`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/form.js)                           | 1.005 Zeilen | Rollen, Lebensstatus, dynamische Listen, Autocomplete, Anzeigename, Export, Reset und ScrollSpy |
| [`validation.js`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/validation.js)               |   125 Zeilen | Feld- und Formularvalidierung                                                                   |
| [`edtf-component.js`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/edtf-component.js)       |   842 Zeilen | EDTF-Datums-, Listen- und Intervallkomponenten einschließlich dynamischem Markup                |
| [`theme.js`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/theme.js)                         |    41 Zeilen | Hell-/Dunkelmodus und Speicherung in `localStorage`                                             |
| [`autocomplete-data.js`](https://github.com/fisphi/look-and-feel_demos_and_mockups/blob/eb4544a63e75b2c590046dd6de5dd61b5ce50f19/docs/person-form-lookfeel/autocomplete-data.js) |   194 Zeilen | Statische Vorschlagsdaten für Autocomplete-Felder                                               |

Die Zeilenzahlen und Fundstellen beziehen sich auf `eb4544a`. Kommentare und auskommentiertes Beispiel-Markup sind im Quellumfang enthalten.

## Technische Basis

| Bereich                 | Nachgewiesener Bestand                                            | Fundstelle                                                        |
| ----------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| Anwendungsform          | statische HTML-Anwendung ohne Build-Prozess                       | `index.html` und direkt eingebundene Dateien                      |
| CSS-Framework           | Bootstrap 5.3.2 über jsDelivr                                     | `index.html:8`                                                    |
| JavaScript-Framework    | Bootstrap Bundle 5.3.2 über jsDelivr                              | `index.html:2247`                                                 |
| Icons                   | Bootstrap Icons 1.11.1 über jsDelivr                              | `index.html:9`                                                    |
| Fachlogik               | Vanilla JavaScript                                                | `form.js`, `validation.js`, `edtf-component.js`, Inline-Skripte   |
| EDTF-Parser             | dynamischer ESM-Import von `edtf@4.11.0` über jsDelivr            | `edtf-component.js:1–2`                                           |
| Feedback-Dienst         | Marker.io wird außerhalb des `file:`-Protokolls dynamisch geladen | `index.html:15–28`                                                |
| PWA-Manifest            | wird außerhalb des `file:`-Protokolls dynamisch eingebunden       | `index.html:16–20`                                                |
| Theme                   | `data-bs-theme="light                                             | dark"`am`<html>`-Element                                          | `index.html:2`, `theme.js:13–18` |
| Theme-Persistenz        | `localStorage` unter `theme`                                      | `theme.js:8–17`                                                   |
| Automatisierte Tests    | nicht gefunden                                                    | keine Testdateien oder Testeinbindung im untersuchten Verzeichnis |
| Build-/Bundling-Schritt | nicht gefunden                                                    | keine lokale Paket- oder Build-Konfiguration für die Demo         |

Ohne Netzwerkverbindung fehlen Bootstrap-CSS, Bootstrap Icons, Bootstrap-JavaScript, der EDTF-Parser und Marker.io. `edtf-component.js` zeigt bei fehlendem Parser eine Fehlermeldung an (`edtf-component.js:833–841`); für die übrigen CDN-Abhängigkeiten existiert kein lokaler Fallback.

## Seiten- und Layoutarchitektur

Die Seite verwendet einen Bootstrap-Fluid-Container mit einer zentrierten Grid-Zeile (`index.html:33–37`). Darin stehen:

1. die Formularspalte mit `col-md-9 col-lg-8 col-xl-7`, zusätzlich inline auf `max-width: 800px` begrenzt (`index.html:37`);
2. die Sidebar mit `col-md-3 col-lg-2` (`index.html:1802–1804`).

Die Sidebar ist über `.sidebar` sticky, auf die Viewporthöhe begrenzt und intern scrollbar (`styles.css:147–154`). Sie enthält:

- eine kompakte Anzeigenamenvorschau (`index.html:1805–1810`);
- Theme-Umschalter (`index.html:1811–1816`);
- 13 Abschnittslinks (`index.html:1817–1831`);
- „Back to Top“, Reset und JSON-Export (`index.html:1833–1843`).

ScrollSpy ist doppelt kenntlich gemacht: deklarativ durch `data-bs-spy` am Inhaltscontainer (`index.html:43`) und programmatisch auf `document.body` (`form.js:933–939`). Die Navigationslinks werden bei der Record-Viewer-Rolle passend zu den sichtbaren Abschnitten ein- und ausgeblendet (`form.js:12–24`, `49–57`).

## Formularhierarchie

Das Formular `#personForm` verwendet `novalidate` (`index.html:62`) und enthält 13 Hauptabschnitte. Jeder Hauptabschnitt folgt im statischen Markup grundsätzlich dem Muster `.form-section > .card > .card-header + .card-body`.

| Nr. | Abschnitt / ID    | Statischer Rollenhinweis                              | Inhalt und vorhandenes Muster                                                       |
| --: | ----------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
|   0 | `#userrolle`      | keiner                                                | vier Radio-Optionen als Demo-Gate, Info- und Draft-Alert                            |
|   1 | `#lebensstatus`   | `wissenschaftler,user`                                | drei große Radio-Auswahlflächen; rechtliches/inhaltliches Gate                      |
|   2 | `#anzeigename`    | keiner                                                | automatisch generierte Read-only-Anzeige in einem Alert                             |
|   3 | `#identitaet`     | `wissenschaftler,user`                                | Grid-Felder, Radio-Gruppe, Titelmodale und dynamische Namensvarianten               |
|   4 | `#normdaten`      | `user`                                                | Normdatenfelder, Input-Groups und Accordion für weitere IDs                         |
|   5 | `#lebensdaten`    | `user`                                                | drei neutrale `.form-subsection`-Bereiche für Geburt, Tod und weitere Daten         |
|   6 | `#taetigkeiten`   | `user`                                                | wiederholbare, verschachtelte Karten mit Rollen, Institution und Zeitraum           |
|   7 | `#orte`           | `user`                                                | acht statische Wirkungsortkarten plus dynamisch ergänzbare Karten                   |
|   8 | `#kontakt`        | `wissenschaftler,user`                                | Einwilligungs-Gate und sensitive Kontaktfelder                                      |
|   9 | `#quellenangaben` | `user`                                                | Quellenkarten, `<dl>`-Detailwerte und Quellenmodal                                  |
|  10 | `#meta`           | `user`                                                | Anmerkungen und Kommentare als verschachtelte Karten/Antwortketten                  |
|  11 | `#record_history` | keiner                                                | Tabelle mit Audit-Beispieldaten und Informationsmodal                               |
|  12 | `#import`         | `user`, zusätzlich `data-hide-when-restricted="true"` | Read-only-Importfelder, formatierte JSON-LD-Anzeige, Raw-Ansicht und Kopierfunktion |

Der Rollenhinweis `data-role-restriction` wird für DB-Owner, Record-Owner und Record-Editor generisch ausgewertet (`form.js:159–189`). Für den Record-Viewer existiert eine gesonderte, restriktivere Logik (`form.js:26–129`).

## Quantitative Komponentenübersicht

Die folgenden Werte sind Quelltextzählungen des statischen `index.html`; zur Laufzeit erzeugte Elemente kommen hinzu.

| Element oder Klasse             | Anzahl im statischen Quelltext |
| ------------------------------- | -----------------------------: |
| Hauptabschnitte `.form-section` |                             13 |
| Karten `.card`                  |                             38 |
| Kartenköpfe `.card-header`      |                             15 |
| Karteninhalte `.card-body`      |                             39 |
| Buttons mit `.btn`              |                             70 |
| kleine Buttons `.btn-sm`        |                             43 |
| Badges `.badge`                 |                             60 |
| Alerts `.alert`                 |                              5 |
| Modale `.modal`                 |                              6 |
| Accordion                       |                              1 |
| Inputs                          |                             56 |
| Selects                         |                              2 |
| Textareas                       |                              7 |
| `<dl>`                          |                              3 |
| Tabelle                         |                              1 |
| Bootstrap-Gridzeilen `.row`     |                             17 |
| `.form-control`                 |                             47 |
| `.form-select`                  |                              2 |
| `.disabled-section`             |                             10 |
| neutrale `.form-subsection`     |                              3 |

Die statische Überschriftenverteilung lautet: ein `h2`, 13 `h3`, drei `h4`, sieben `h5` und vier `h6`. Ein `h1` ist nicht vorhanden.

## Komponenten- und Mustersystem

### Hauptabschnitt und Karten

Hauptabschnitte sind fast vollständig Bootstrap-Karten. Gate-Abschnitte verwenden farbige Kartenköpfe (`bg-primary text-white`), reguläre Abschnitte überwiegend neutrale Kartenköpfe. Innerhalb der Hauptkarten werden weitere Karten eingesetzt für:

- Tätigkeiten (`index.html:788–845`);
- Wirkungsorte (`index.html:864–1143`);
- Quellen (`index.html:1218–1353`);
- Anmerkungen, Kommentare und Antworten (`index.html:1380–1538`);
- Sidebar-Anzeigename (`index.html:1805–1810`).

Damit übernimmt `.card` sowohl Seitenabschnitt, wiederholbaren Datensatz, Metadatenblock als auch Navigationsvorschau.

### Standardfelder

Der überwiegende Feldaufbau besteht aus Bootstrap-Gridspalten mit `.form-label` und `.form-control` beziehungsweise `.form-select`. Zusätzliche Varianten sind:

- `.input-group` für Normdaten mit externem Link;
- `.form-control-comfortable` mit `min-height: 3rem` für Geburts- und Sterbeort (`styles.css:443–445`);
- `readonly`-Felder für Importdaten und EDTF-Ausgaben;
- tatsächlich `disabled` gesetzte Felder aufgrund von Lebensstatus, Rolle oder Einwilligung;
- `.has-value` als grüner Bestandswertzustand (`styles.css:120–129`, `form.js:815–832`);
- Bootstrap `.is-valid` und `.is-invalid` aus der Validierung (`validation.js:37–67`).

### Radio- und Checkbox-Gruppen

Die vier Rollen verwenden normale `.form-check`-Radios (`index.html:80–125`). Die drei Lebensstatuswerte werden als vollständig eigene Kacheln `.lebensstatus-option` dargestellt (`index.html:151–176`, `styles.css:299–358`). Die Einwilligung ist eine einzelne Bootstrap-Checkbox (`index.html:1160–1169`).

`fieldset` und `legend` werden für diese Gruppen nicht verwendet.

### Dynamische Kurzzeilen

`.dynamic-field-row` ist ein Flex-Muster aus Eingabe beziehungsweise Autocomplete und Löschen-Button (`styles.css:261–265`). Es wird eingesetzt für:

- statische und dynamische Namensvarianten (`index.html:310–337`, `form.js:610–710`);
- dynamisch ergänzte Rollen innerhalb einer Tätigkeit (`form.js:338–375`).

Die beiden Erzeugungswege duplizieren Struktur und Löschlogik. Dynamisch erzeugte reine Papierkorb-Buttons erhalten in `form.js:363–367` und `670–674` keinen zugänglichen Namen.

### Autocomplete

Autocomplete verwendet `.autocomplete-wrapper`, `.autocomplete-input`, `.autocomplete-dropdown` und `.autocomplete-item` (`styles.css:266–297`). Die Logik:

- filtert lokale Arrays aus `autocomplete-data.js` (`form.js:713–724`);
- erzeugt Treffer als `<div>` (`form.js:725–751`);
- unterstützt Maus, Fokus, Pfeiltasten, Enter und Escape (`form.js:739–800`);
- initialisiert statische Felder bei `DOMContentLoaded` (`form.js:804–813`);
- initialisiert dynamisch erzeugte Felder unmittelbar nach dem Einfügen.

ARIA-Rollen wie `combobox`, `listbox` und `option`, `aria-expanded`, `aria-controls` sowie die aktive Option über `aria-activedescendant` sind nicht vorhanden.

### Lebensdaten und EDTF

Der Stand `eb4544a` enthält erstmals ein teilweise neutrales Teilsystem:

- `.form-section-title`;
- `.form-layout-container`;
- `.form-subsection-stack`;
- `.form-subsection`;
- `.form-subsection-title`;
- `.compact-value-grid`;
- `.compact-value-label`;
- `.compact-value-primary`;
- `.compact-value-detail`;
- `.compact-value-action`;
- `.form-empty-state` und `.form-empty-state-title`;
- `.repeatable-entry`.

Das statische Markup nutzt drei `.form-subsection`-Abschnitte für Geburt, Tod und weitere Lebensdaten (`index.html:603–649`). Die eigentlichen Datumsoberflächen werden durch `EdtfDateInput`, `EdtfDateList` und `EdtfIntervalInput` dynamisch erzeugt (`edtf-component.js:202–379`, `438–538`, `539–722`).

Die EDTF-Komponenten erzeugen zusätzlich:

- kompakte Wert-/Interpretations-/Aktionsraster;
- Bootstrap-Modale für maskierte Datumseingabe;
- Info-, Hinzufügen-, Bearbeiten-, Entfernen-, Übernehmen- und Abbrechen-Aktionen;
- Fehlercontainer mit `role="status"` und `aria-live="polite"`;
- versteckte beziehungsweise Read-only-Ausgabefelder;
- dynamische `.repeatable-entry`-Listeneinträge;
- Custom Events `edtf-entry-added` und `edtf-wirkungsort-added`.

Die Aktionsschaltfläche `.edtf-edit-action` ist 2,25 × 2,25 rem groß (`styles.css:252–259`). Ihre Beschriftung und ihr `aria-label` wechseln abhängig davon, ob bereits ein Wert vorhanden ist (`edtf-component.js:325–347`).

Die früheren Klassen `.life-data-main-title`, `.life-data-section`, `.life-data-section-title` und `.life-data-place` sind im aktuellen Stand nicht mehr vorhanden. Die EDTF-spezifischen Klassen bleiben bestehen.

### Tätigkeiten

Tätigkeiten bestehen aus `.taetigkeiten-entry` mit Rahmen, Radius und Innenabstand. Statisches Beispiel und dynamisch erzeugte Einträge verwenden weitgehend dasselbe visuelle Kartenmuster, aber nicht dieselbe zentrale Renderfunktion (`index.html:788–845`, `form.js:338–464`).

Ein Eintrag enthält Bezeichnung, Institution, Abteilung, Rollen, Zeitraum und Beschreibung. In diesem Bereich steht weiterhin der sichtbare Hinweis, Tätigkeiten und Wirkungsorte zusammenzuführen (`index.html:659`).

### Wirkungsorte

Wirkungsorte verwenden `.wirkungsort-item`, `.wirkungsort-meta` und `.wirkungsort-actions` (`styles.css:611–629`). Acht Beispiele stehen bereits im HTML; weitere Karten werden durch `createWirkungsortCard()` erzeugt (`form.js:466–537`).

Ein Eintrag kombiniert Ortsname, Zeitraum, Institution, Rolle, Beschreibung, mehrere farbige Badges sowie Bearbeiten-/Löschen-Aktionen. Die Aktionsbuttons besitzen mindestens 2,4 rem Breite. Auch dieser Abschnitt enthält einen sichtbaren Zusammenführungshinweis (`index.html:860`).

### Quellen

Quellen verwenden Karten und `.source-detail-list` mit `<dl>`, wobei jedes `<dd>` nochmals einen eigenen Rahmen, Hintergrund, Radius und inneren Schatten erhält (`styles.css:631–659`). Die Anlage erfolgt über `#sourceModal`; abhängig vom Quellentyp werden Zotero- oder manuelle Felder ein- und ausgeblendet (`index.html:1892–1995`, Inline-Skript `index.html:2439–2501`).

### Anmerkungen und Kommentare

Der Abschnitt `#meta` verwendet Alerts als Einführung, Karten für Beiträge und `border-start` für Antwortketten (`index.html:1364–1541`). Schreibaktionen öffnen `#commentModal` oder `#newNoteModal`. Für Record-Viewer werden diese Trigger ausgeblendet und deaktiviert und die Modale `inert` gesetzt (`form.js:29–33`, `109–118`).

### Record History und Importanzeige

Record History ist eine Bootstrap-Tabelle mit Badges und eigenen Zeitstempel-Tooltips (`index.html:1545–1658`, `styles.css:661–701`). Importdaten kombinieren Read-only-Felder, eine formatierte `<pre>`-Ansicht, eine verborgene Raw-Textarea und Kopier-/Umschaltaktionen (`index.html:1662–1796`, Inline-Skript `index.html:2315–2419`).

## Bootstrap-Inventur

### Verwendete Bootstrap-Komponenten

| Bootstrap-Bereich  | Konkreter Einsatz                                     | Abhängigkeit                               |
| ------------------ | ----------------------------------------------------- | ------------------------------------------ |
| Grid               | Seitenlayout und Feldanordnung                        | umfangreich im HTML und dynamischen Markup |
| Cards              | Hauptabschnitte und verschachtelte Datensätze         | strukturell und visuell                    |
| Buttons            | sämtliche Aktionen und Links                          | visuell; global überschrieben              |
| Forms              | Controls, Labels, Checks, Input-Groups, Feedback      | strukturell und visuell                    |
| Alerts             | Hinweise, Rolleninfo und Anzeigename                  | visuell und semantisch gemischt            |
| Badges             | Demo-Status, Metadaten, Rollen, Orte, Auditdaten      | visuell                                    |
| Modal              | sechs statische und mehrere dynamische EDTF-Dialoge   | Bootstrap-JavaScript zwingend              |
| Collapse/Accordion | erweiterte Normdaten                                  | Bootstrap-JavaScript zwingend              |
| ScrollSpy          | Sidebar-Navigation                                    | Bootstrap-JavaScript zwingend              |
| Utilities          | Abstände, Flex, Grid, Farbe, Sichtbarkeit, Typografie | flächendeckend                             |
| Icons              | Aktionen, Status, externe Links                       | CDN-Schrift/Stylesheet zwingend            |

### Globale Überschreibungen

`styles.css` überschreibt Bootstrap-Klassen global, insbesondere:

- `.bg-primary` bis `.bg-dark` (`styles.css:19–51`);
- `.alert-primary` bis `.alert-dark` (`styles.css:53–96`);
- `.form-control`, `.form-select` und `textarea.form-control` (`styles.css:113–129`);
- `.card` und `.table` (`styles.css:131–145`);
- `.btn`, gefüllte und Outline-Varianten sowie `.btn-sm` (`styles.css:488–579`).

Diese Regeln verändern alle jeweiligen Bootstrap-Instanzen, unabhängig vom fachlichen Kontext.

## CSS-Inventur

### Umfang und Struktur

`styles.css` besitzt 701 Zeilen und 121 öffnende Regel-/At-Rule-Blöcke. Die Datei ist fortlaufend organisiert; `@layer` oder getrennte Dateien für Tokens, Basis, Komponenten, Utilities und Zustände sind nicht vorhanden.

Nachgewiesen sind:

- 51 Vorkommen von `!important`;
- 23 Deklarationen eigener beziehungsweise überschriebener Custom Properties;
- 58 Hex-Farbvorkommen;
- 47 `rgb()`/`rgba()`-Vorkommen;
- eine klassische Media Query;
- eine Container Query.

### Farbvariablen und direkte Werte

Im hellen Theme werden unter `:root` vor allem Bootstrap-Variablen überschrieben (`styles.css:2–17`): Rahmen, Text, Primär-, Erfolgs-, Gefahren-, Muted-, Sekundär- und Seitenhintergrund. Das dunkle Theme definiert einen Teil davon separat neu (`styles.css:98–111`).

Daneben verwenden Background-Utilities, Alerts, Zustände, Buttons, JSON-Syntax, Tooltips und einzelne Komponenten direkte Hex- und `rgba()`-Werte. Abstände, Typografie, Radien, Schatten, Controlhöhen und Aktionsgrößen besitzen keine formularweit benannten Custom Properties.

### Kontrastbestand

Gefüllte Buttons erzwingen weiße Schrift auf den Pastellfarben (`styles.css:499–513`). Dasselbe geschieht für ausgewählte Lebensstatusflächen (`styles.css:325–353`). Rechnerisch ergeben sich im hellen Theme ungefähr:

| Kombination                   | Kontrastverhältnis |
| ----------------------------- | -----------------: |
| Weiß auf Primärblau `#8fbce6` |              2,0:1 |
| Weiß auf Mint `#a8d5b7`       |              1,6:1 |
| Weiß auf Rosa `#e7a8b0`       |              2,0:1 |

Diese Werte liegen unter 4,5:1 für normalen Text und unter 3:1 für großen Text beziehungsweise grafische UI-Komponenten.

### Abstände

Abstände werden überwiegend über Bootstrap-Utilities erzeugt. Im statischen HTML kommen besonders häufig vor:

- `mb-3`: 41-mal;
- `mb-0`: 37-mal;
- `mb-2`: 24-mal;
- `gap-2`: 17-mal;
- `g-3`: 16-mal;
- `mb-5`: bei allen 13 Hauptabschnitten.

Daneben definieren eigene Komponenten weitere feste Abstände, etwa `.row-separator`, `.form-subsection`, `.compact-value-grid`, `.dynamic-field-row`, Quellenwerte und Tooltips. Es existiert kein eigenes dokumentiertes Spacing-Tokensystem im CSS.

### Radien und Schatten

Bootstrap-Radien, Utility-Radien und eigene Werte werden parallel verwendet. Eigene Regeln enthalten unter anderem `0.35rem`, `0.375rem`, `0.5rem`, `0.65rem` und `0.75rem`. Schatten treten als Fokus-/Wert-Ring, Dropdown-Schatten, Lebensstatus-Schatten, Button-Hover-Schatten und innerer Quellenwert-Schatten auf.

### Responsive Regeln

Vorhanden sind:

1. Bootstrap-Grid-Breakpoints über Klassen wie `col-md-*`, `col-lg-*`, `col-xl-*`;
2. eine eigene Media Query bei `max-width: 575.98px` für das EDTF-Kompaktraster (`styles.css:462–469`);
3. eine Container Query bei `min-width: 62rem` für eine zweispaltige `.form-subsection-stack` (`styles.css:471–486`).

`.form-layout-container` aktiviert `container-type: inline-size` (`styles.css:377–379`). Der Container liegt jedoch innerhalb der inline auf maximal 800 px begrenzten Formularspalte (`index.html:37`). `62rem` entsprechen bei 16 px Root-Schriftgröße ungefähr 992 px. Die Container Query kann unter dieser Struktur nicht greifen; Geburt und Tod bleiben einspaltig.

Eigene Tablet- oder Zwischenbreitenregeln außerhalb des Bootstrap-Grids wurden nicht gefunden.

### Benennung

Im Bestand stehen mehrere Benennungsebenen nebeneinander:

- Bootstrap-Komponenten und Utilities: `.card`, `.btn`, `.mb-3`, `.d-flex`;
- neutrale eigene Komponenten: `.form-subsection`, `.compact-value-grid`, `.repeatable-entry`;
- fachliche Komponenten: `.lebensstatus-option`, `.wirkungsort-item`, `.source-detail-list`;
- technische EDTF-Klassen: `.edtf-summary`, `.edtf-edit-action`, `.edtf-output`;
- Zustandsklassen: `.disabled-section`, `.has-value`, `.is-valid`, `.is-invalid`, `.d-none`.

Eine durchgängige Namenskonvention wie BEM, CUBE CSS oder ein eigenes Präfix ist nicht vorhanden.

## Interaktionsinventur

| Interaktion             | Umsetzung und Fundstelle                                          | Dynamische Auswirkungen                                                      |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Rollenwechsel           | `updateRolePermissions()` in `form.js:131–193`                    | Klassen, Navigation, Record-Viewer-Sichtbarkeit und Custom Event             |
| Record-Viewer           | `applyViewerPermissions()` in `form.js:86–129`                    | Abschnitte `hidden`/`inert`, Controls deaktiviert, Schreibaktionen verborgen |
| Lebensstatus            | `updateFormState()` in `form.js:551–608`                          | Sektionen freigeben, Sterbedaten steuern, Kontaktstatus neu berechnen        |
| Kontakt-Einwilligung    | `updateKontaktFields()` in `form.js:577–604`                      | Kontaktfelder abhängig von Einwilligung und Rolle deaktivieren               |
| Anzeigename             | `updateAnzeigename()` in `form.js:274–336`                        | Name, Lebensdaten-, Sammlungs- und Normdatensuffixe aktualisieren            |
| Tätigkeiten             | IIFE `form.js:338–464`                                            | Einträge und Rollenfelder erzeugen/entfernen, Autocomplete initialisieren    |
| Wirkungsorte            | `createWirkungsortCard()` in `form.js:466–537`                    | Karte, Intervallkomponente und Entfernen-Aktion erzeugen                     |
| Dynamische Kurzfelder   | `createDynamicField()`/`addDynamicField()` in `form.js:627–710`   | Namensvarianten/Rollen ergänzen und entfernen                                |
| Autocomplete            | `initAutocomplete()` in `form.js:713–802`                         | Trefferlisten rendern, aktive Option und Tastatursteuerung verwalten         |
| Bestandswert-Markierung | `updateHighlight()` in `form.js:819–831`                          | `.has-value` auf Inputs/Selects setzen                                       |
| JSON-Export             | `collectPersonFormData()` und Exportlistener in `form.js:835–931` | aktivierte, benannte Felder sammeln und Datei herunterladen                  |
| Reset                   | `attachResetButton()` in `form.js:942–1005`                       | Felder leeren, dynamische Einträge entfernen, Gates neu auslösen             |
| ScrollSpy               | `form.js:933–939`                                                 | aktiven Sidebar-Link setzen                                                  |
| Feldvalidierung         | `validateField()` in `validation.js:37–67`                        | `.is-valid`/`.is-invalid` und Feedbacktext setzen                            |
| Formularvalidierung     | `validateForm()` in `validation.js:87–125`                        | EDTF, Lebensstatus, Nachname und `data-validate`-Felder prüfen               |
| Theme                   | `theme.js:7–38`                                                   | `data-bs-theme`, Icon und `localStorage` ändern                              |
| EDTF-Datum              | `EdtfDateInput` in `edtf-component.js:202–379`                    | komplette Kompaktansicht und Modal erzeugen                                  |
| EDTF-Liste              | `EdtfDateList` in `edtf-component.js:438–538`                     | Einträge erzeugen, sortieren/aktualisieren und entfernen                     |
| EDTF-Intervall          | `EdtfIntervalInput` in `edtf-component.js:539–722`                | Start-/Endwerte, offene/ungewisse Grenzen und Modal verwalten                |
| Chronologie             | `validateChronology()` in `edtf-component.js:768–799`             | Geburts-/Sterbedaten fachlich gegeneinander prüfen                           |
| Import-JSON             | Inline-Skript `index.html:2315–2419`                              | JSON formatieren, Syntax hervorheben, Raw-Modus und Kopieren                 |
| Quellenmodal            | Inline-Skript `index.html:2439–2501`                              | Zotero-/manuelle Bereiche schalten und Modal zurücksetzen                    |
| Zurück nach oben        | Inline-Skript `index.html:2421–2437`                              | Sichtbarkeit nach Scrollposition und Scrollaktion                            |

## Rollen-, Sichtbarkeits- und Schreiblogik

### Generische Rollenlogik

Die Rollenwerte sind:

- `kurator`: DB-Owner;
- `kustode`: Record-Owner;
- `wissenschaftler`: Record-Editor;
- `user`: Record-Viewer.

Für die ersten drei Rollen wertet `updateRolePermissions()` die kommagetrennten Werte in `data-role-restriction` aus (`form.js:159–189`). Eingeschränkte Abschnitte erhalten grundsätzlich `.disabled-section`; nur `data-hide-when-restricted="true"` führt zu `.d-none`.

`.disabled-section` legt ein Overlay über den Bereich (`styles.css:182–202`), setzt die enthaltenen Controls aber nicht generisch auf `disabled` oder `inert`. Damit ist die Sperre für diese Rollen überwiegend visuell und pointerbasiert.

### Record-Viewer

Der Record-Viewer verwendet nicht nur `data-role-restriction`, sondern eine eigene Whitelist:

- immer sichtbar: `#anzeigename`, `#meta` (`form.js:26`);
- bei lebenden Personen zusätzlich: `#identitaet`, `#quellenangaben` (`form.js:27`, `86–107`);
- in `#identitaet` bei lebenden Personen nur `#vorname` und `#nachname` (`form.js:28`, `96–107`).

Alle sichtbaren Controls werden deaktiviert. Nicht erlaubte Abschnitte erhalten `d-none`, `hidden` und – sofern unterstützt – `inert`; zugehörige Navigationslinks werden verborgen (`form.js:49–57`, `89–94`). Kommentar-, Anmerkungs- und Quellenaktionen werden verborgen und deaktiviert, ihre Modale `inert` gesetzt (`form.js:109–118`). Reset und Export werden verborgen, deaktiviert und zusätzlich in ihren Event-Handlern blockiert (`form.js:120–127`, `908–910`, `945–947`). `validateForm()` beendet die Prüfung für `user` sofort erfolgreich (`validation.js:87–92`).

Der Demo-Abschnitt `#userrolle` bleibt sichtbar und bedienbar, damit Rollen gewechselt werden können (`form.js:89–91`).

Die Daten selbst verbleiben vollständig im HTML und im JavaScript-Speicher. `window.collectPersonFormData` wird global veröffentlicht (`form.js:906`). Die clientseitige Logik verhindert reguläre Bedienung, stellt aber keine Zugriffskontrolle gegen Quelltext-/DevTools-Zugriff oder DOM-Manipulation dar.

## Validierungs- und Zustandsinventur

### Validierung

`validation.js` definiert Regex-Regeln für E-Mail, Telefon, URL und mehrere Normdatenformate (`validation.js:1–16`). Feldvalidierung wird auf `blur` und nach einem Fehler erneut auf `input` ausgeführt (`validation.js:69–84`). Leere optionale Felder gelten als valide.

Die Gesamtvalidierung prüft:

- alle EDTF-Komponenten über `window.EDTFForm.validateAll()`;
- ausgewählten Lebensstatus;
- Nachname als Pflichtfeld;
- alle aktivierten, nicht leeren Felder mit `data-validate`.

Der Record-Viewer wird nicht validiert, weil er keine Schreibaktion ausführen darf.

### Leer-, Anzeige- und Read-only-Zustände

Parallel vorhanden sind:

- Gedankenstrich `—` in Anzeigenamen und Datumsanzeigen;
- `.form-empty-state` im neuen Lebensdatenmuster;
- einfacher gedämpfter Text;
- Bootstrap-Alert als Datenanzeige;
- `d-none` beziehungsweise `hidden`;
- `readonly`-Inputs und -Textareas;
- tatsächlich `disabled` gesetzte Controls;
- `.disabled-section` als visuelles Overlay;
- `<dl>` mit gerahmten Werten;
- Tabelle;
- formatierte `<pre>`-Anzeige;
- komponentenspezifische EDTF-Zustände.

Für „nicht vorhanden“, „unbekannt“, „nicht anwendbar“, „verborgen“, „read-only“ und „deaktiviert“ existiert formularweit keine einheitliche semantische oder visuelle Kodierung.

## Typografie und semantische Struktur

Der sichtbare Seitentitel steht in einem `h4`, das zusätzlich ein `<div>` mit vier Statusbadges enthält (`index.html:44–53`). Hauptabschnitte verwenden `h3` mit der visuellen Bootstrap-Klasse `.h5`. Darunter kommen vor:

- `h4.form-subsection-title` für Geburt und Tod;
- `h6` für Tätigkeiten, Kommentare und Quellenuntergruppen;
- `h2.accordion-header` für erweiterte Normdaten;
- `h5` für Sidebar und Modaltitel;
- Labels, `<strong>` und Größenutilities als visuelle Zwischenüberschriften.

Ein `h1` fehlt. Die semantische Reihenfolge springt dadurch zwischen Ebenen; visuelle Größe und Dokumentebene sind nicht systematisch getrennt.

## Accessibility-Inventur

### Vorhandene Maßnahmen

- Dokumentensprache ist `de` (`index.html:2`).
- Labels sind bei vielen Standardfeldern korrekt über `for` und `id` verbunden.
- statische Wirkungsortaktionen besitzen objektspezifische `aria-label` (`index.html:887–1139`);
- der Back-to-Top-Button besitzt `aria-label` (`index.html:1833–1835`);
- EDTF-Fehler verwenden `role="status"` und `aria-live="polite"`;
- EDTF-Iconaktionen erhalten dynamische zugängliche Namen;
- verborgene Record-Viewer-Abschnitte werden zusätzlich `hidden` und `inert` gesetzt;
- Zeitstempel-Tooltips reagieren auf `:focus-visible` (`styles.css:696–700`).

### Nachgewiesene Lücken

- kein `h1` und inkonsistente Überschriftenhierarchie;
- keine `fieldset`/`legend`-Semantik für Rollen-, Lebensstatus- oder Geschlechtsradios;
- Autocomplete ohne Combobox-/Listbox-ARIA;
- dynamisch erzeugte Papierkorb-Iconbuttons ohne zugänglichen Namen (`form.js:363–367`, `670–674`);
- Theme-Button mit `title`, aber ohne explizites `aria-label` und ohne `aria-pressed` (`index.html:1813–1815`);
- sechs statische Modal-Schließen-Buttons sind englisch mit `aria-label="Close"` benannt (`index.html:1855`, `1876`, `1897`, `2007`, `2101`, `2199`);
- Fokusgestaltung ist außerhalb der Bootstrap-Defaults und einzelner Tooltips nicht systematisch definiert;
- weiße Schrift auf mehreren Pastellflächen unterschreitet die Kontrastanforderungen;
- `.disabled-section` verhindert keine Tastaturnavigation oder programmgesteuerte Aktivierung, wenn Controls nicht zusätzlich tatsächlich deaktiviert werden.

## Sprach- und Demoebene

Die Oberfläche ist überwiegend deutsch, enthält aber sichtbare englische Bezeichnungen:

- „Back to Demos“ (`index.html:40`);
- „Back to Top“ (`index.html:1835`);
- „Save“ und „Cancel“ im Quellenmodal (`index.html:1993–1994`);
- `aria-label="Close"` in sechs Modalen;
- „Record History“ und „Readonly“ in fachlichen Überschriften.

Demo- und Fachoberfläche stehen in derselben Hierarchie. Sichtbar sind unter anderem vier Statusbadges `look&feel`, `mockup`, `demo`, `draft`, die Rollenwahl, Draft-/TBD-/TBF-Hinweise, Theme-Steuerung, Export, Reset und Beispieldaten.

## Belegte Defekte und technische Schulden

| ID    | Schwere | Befund                                                                                                 | Nachweis                                                                    | Auswirkung                                                                          |
| ----- | ------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| UI-01 | hoch    | Container Query ist strukturell unerreichbar                                                           | `index.html:37`, `styles.css:377–379`, `471–486`                            | vorgesehene zweispaltige Lebensdatenansicht tritt nicht ein                         |
| UI-02 | hoch    | unzureichender Kontrast auf Pastellaktionen und ausgewählten Lebensstatusflächen                       | `styles.css:325–353`, `499–513`                                             | normaler Text liegt deutlich unter WCAG 4,5:1                                       |
| UI-03 | hoch    | generische Rollensperre beruht überwiegend auf Overlay                                                 | `form.js:159–189`, `styles.css:182–215`                                     | Controls können per Tastatur/DOM weiterhin erreichbar sein                          |
| UI-04 | hoch    | Record-Viewer-Schutz ist ausschließlich clientseitig                                                   | `form.js:26–129`, `835–931`; Daten in `index.html`                          | verborgene Daten bleiben über Quelltext/DevTools grundsätzlich zugänglich           |
| UI-05 | hoch    | Autocomplete besitzt keine Combobox-/Listbox-Semantik                                                  | `form.js:713–802`                                                           | eingeschränkte Verständlichkeit für Assistenztechnologien                           |
| UI-06 | hoch    | Überschriftenstruktur ist semantisch inkonsistent                                                      | `index.html:44`, `68`, `436`, `611`, `792`                                  | erschwerte Dokumentnavigation und Orientierung                                      |
| UI-07 | mittel  | Tippfehler trennt `.alert-secondary` in zwei Klassen                                                   | `index.html:194` (`alert-sec ondary`)                                       | vorgesehene Alert-Variante greift nicht                                             |
| UI-08 | mittel  | weiße Pastell-Buttonschrift wird mit `!important` erzwungen                                            | `styles.css:499–513`                                                        | lokale Korrekturen benötigen zusätzliche Spezifität/Overrides                       |
| UI-09 | mittel  | 51 `!important` und globale Bootstrap-Overrides                                                        | `styles.css`                                                                | hohe Kopplung und erschwerte kontrollierte Weiterentwicklung                        |
| UI-10 | mittel  | dynamische Icon-Löschbuttons sind unbenannt                                                            | `form.js:363–367`, `670–674`                                                | Aktion hat für Screenreader keinen belastbaren Namen                                |
| UI-11 | mittel  | Autocomplete-Markup und dynamische Listen werden an mehreren Stellen separat erzeugt                   | `form.js:338–464`, `466–537`, `610–710`                                     | divergierende Varianten und mehrfach zu pflegende Logik                             |
| UI-12 | mittel  | Reset entfernt `disabled` pauschal vor erneuter Gate-Auswertung                                        | `form.js:953–985`                                                           | kurzfristig inkonsistenter Zustand; Verhalten hängt von Eventreihenfolge ab         |
| UI-13 | mittel  | ORCID-Linkformatierung enthält nicht interpolierte Platzhalter                                         | `form.js:249–250`                                                           | erzeugter Anzeigenamen-Suffix enthält literale `${…}`-Fragmente statt URL/Wert      |
| UI-14 | mittel  | externe Laufzeitabhängigkeiten ohne vollständige lokale Fallbacks                                      | `index.html:8–9`, `2247`; `edtf-component.js:3–15`                          | Offline-Darstellung und zentrale Interaktionen fallen aus                           |
| UI-15 | mittel  | Inline-Breitenbegrenzung und fünf Inline-Skriptblöcke                                                  | `index.html:15–29`, `37`, `2253–2501`                                       | Layout- und Interaktionslogik sind nicht vollständig in ihren Dateien zentralisiert |
| UI-16 | mittel  | Karten, Badges und Aktionsvarianten werden sehr häufig und für unterschiedliche Bedeutungen eingesetzt | 38 Karten, 60 Badges, 70 Buttons im statischen HTML                         | geringe visuelle Bedeutungsstabilität und hohe Mustervielfalt                       |
| UI-17 | mittel  | Tätigkeiten und Wirkungsorte überlappen fachlich und verweisen gegenseitig auf eine Zusammenführung    | `index.html:659`, `860`                                                     | zwei parallele wiederholbare Strukturen für teilweise gleiche Daten                 |
| UI-18 | niedrig | deutsche und englische UI-Texte sind gemischt                                                          | `index.html:40`, `1835`, `1855–2199`                                        | inkonsistente Sprache und zugängliche Benennung                                     |
| UI-19 | niedrig | CSS besitzt keine erkennbare Schichten- oder Präfixstruktur                                            | gesamte `styles.css`                                                        | neutrale, fachliche und Framework-Klassen sind vermischt                            |
| UI-20 | niedrig | EDTF-Interpretation liegt innerhalb eines `<code>`-Elements                                            | dynamisches Markup in `edtf-component.js:217–248`, CSS `styles.css:246–250` | Interpretation erscheint ebenfalls im Code-/Monospace-Kontext                       |

## Nicht gefundene Systembausteine

Im analysierten Stand wurden nicht gefunden:

- automatisierte Unit-, Integrations-, Accessibility- oder visuelle Regressionstests;
- ein CSS-Tokensystem für Abstände, Typografie, Radien, Schatten und Aktionsgrößen;
- CSS-Layer oder eine dokumentierte CSS-Schichtenarchitektur;
- zentrale Renderfunktionen für alle wiederholbaren Datensatztypen;
- native `<dialog>`-, `<details>`- oder `<summary>`-Komponenten;
- `fieldset` und `legend` für zusammengehörige Auswahlgruppen;
- serverseitige Rollen- oder Feldberechtigungen;
- ein lokaler Fallback für Bootstrap, Bootstrap Icons und den EDTF-Parser;
- eine einheitliche Semantik für leer, unbekannt, nicht anwendbar, verborgen, read-only und deaktiviert;
- eine formularweite Definition von Fokus-, Hover-, Active- und Disabled-Zuständen;
- eigene responsive Regeln für Tablet- und mittlere Inhaltsbreiten außerhalb des Bootstrap-Grids.

## Gegenüber der Inventur von `7aa3839` geänderter Bestand

Die vorherige Inventur kann nicht unverändert fortgeführt werden. Auf `eb4544a` sind folgende Änderungen nachgewiesen:

| Früher dokumentiert                               | Bestand in `eb4544a`                                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 651 CSS-Zeilen                                    | 701 CSS-Zeilen                                                                                  |
| keine Container Query                             | eine Container Query bei `62rem`, derzeit unerreichbar                                          |
| `.life-data-main-title`                           | nicht mehr vorhanden; `.form-section-title` vorhanden                                           |
| `.life-data-section`                              | nicht mehr vorhanden; `.form-subsection` vorhanden                                              |
| `.life-data-section-title`                        | nicht mehr vorhanden; `.form-subsection-title` vorhanden                                        |
| `.life-data-place`                                | nicht mehr vorhanden; Ortsfelder nutzen `.form-control-comfortable`                             |
| nur fachgebundener EDTF-Leerzustand               | `.form-empty-state` und `.form-empty-state-title` vorhanden                                     |
| kein neutrales Listeneintragsmuster               | `.repeatable-entry` für dynamische EDTF-Datumseinträge vorhanden                                |
| Lebensdatenlinie als Überschriftenunterstreichung | Trennlinie zwischen aufeinanderfolgenden `.form-subsection`-Bereichen                           |
| allgemein beschriebene Viewer-Sperre              | explizite Whitelist, `hidden`, `inert`, echte Control-Deaktivierung und Aktionsguards vorhanden |

## Zusammenfassung des Ist-Zustands

Die Demo besitzt ein funktionsreiches statisches Bootstrap-Grundgerüst mit 13 fachlichen und technischen Hauptabschnitten, mehreren Rollen- und Lebensstatus-Gates, dynamischen Listen, Autocomplete, EDTF-Level-1-Erfassung, Validierung, Hell-/Dunkelmodus, Importanzeige und JSON-Export.

`eb4544a` führt für Lebensdaten erstmals neutraler benannte Unterabschnitts-, Kompaktwert-, Leerzustands- und Listeneintragsmuster ein. Diese bilden im aktuellen Code jedoch nur ein Teilsystem. Tätigkeiten, Wirkungsorte, Quellen, Kommentare, Read-only-Anzeigen und Aktionen verwenden weiterhin eigene Strukturen.

Die größten nachgewiesenen technischen Risiken des Bestands sind die unerreichbare Container Query, schwache Farbkontraste, die visuelle Sperrlogik für generische Rollen, ausschließlich clientseitige Viewer-Berechtigungen, fehlende ARIA-Semantik des Autocomplete und die starke Kopplung durch globale Bootstrap-Overrides sowie 51 `!important`-Deklarationen.
