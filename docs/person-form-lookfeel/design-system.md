# Designsystem für die Personen- und Institutionen-Anwendung

Status: Arbeitsgrundlage für die evolutionäre Migration  
Analysierter Codebestand: `eb4544a63e75b2c590046dd6de5dd61b5ce50f19` vom 31. Juli 2026  
Geltungsbereich: `docs/person-form-lookfeel` und daraus hervorgehende statische Oberflächen  
Technik: semantisches HTML, CSS und Vanilla JavaScript; kein Build-Prozess erforderlich

## 1. Zweck und Geltungsbereich

Dieses Dokument beschreibt den belegten Ist-Zustand des Personenformulars, bewertet seine Komponenten und legt den Zielzustand für eine schrittweise Modernisierung fest. Es ist gleichzeitig:

- Inventur des bestehenden UI-, CSS- und Interaktionssystems;
- verbindliche Gestaltungs- und Implementierungsgrundlage;
- Entscheidung zur weiteren Bootstrap-Nutzung;
- Migrationsplan einschließlich vollständiger Migrationsmatrix;
- Prüfbasis für neue Komponenten und spätere Refactorings.

Das Dokument ist kein Auftrag zum sofortigen Austausch des bestehenden Codes. Fachliche Feldbedeutungen, Validierungen, Rollen, Sichtbarkeitsregeln, EDTF-Logik, Beispieldaten und bestehende Interaktionen bleiben bei jeder Migration erhalten, bis eine fachliche Änderung separat beschlossen und getestet wurde.

## 2. Nachweis- und Entscheidungskennzeichnung

Die folgenden Kennzeichnungen werden verwendet:

- **Bestand:** im analysierten Code nachgewiesen.
- **Fachlicher Bedarf:** aus einer vorhandenen Funktion oder Datenstruktur abgeleitet.
- **Zielentscheidung:** verbindliche künftige Regel dieses Designsystems.
- **Empfehlung:** sinnvolle, aber noch nicht zwingend terminierte Verbesserung.
- **Offen:** vor der Umsetzung fachlich oder technisch zu entscheiden.

Zeilenangaben beziehen sich auf den oben genannten Commit. Dynamisch erzeugtes Markup wird mit dem erzeugenden Funktions- oder Klassennamen belegt.

## 3. Produkt- und Nutzungskontext

Die Oberfläche dient der wissenschaftlichen Erfassung, Prüfung und Pflege von Personen- und später Institutionsdaten. Sie muss viele heterogene Angaben, Normdaten, Zeitangaben, Beziehungen, Quellen, Kommentare und administrative Metadaten effizient handhabbar machen.

Prioritäten:

1. fachliche Eindeutigkeit und Datenintegrität;
2. rollen- und statusgerechte Sichtbarkeit und Bearbeitbarkeit;
3. effiziente Tastatur- und Desktopnutzung;
4. belastbare Accessibility;
5. ruhige, präzise Informationshierarchie;
6. responsive Nutzbarkeit ohne Verlust fachlicher Dichte;
7. langfristige Wartbarkeit ohne Framework- oder Build-Zwang.

Die UI ist kein Marketingprodukt und kein generisches SaaS-Dashboard. Typografie, Nähe, Reihenfolge und sparsame Trennlinien tragen die Hierarchie. Karten, Farben, Schatten, Icons und Badges werden nur eingesetzt, wenn sie eine konkrete Funktion oder einen Zustand verdeutlichen.

## 4. Technischer Ist-Zustand

### 4.1 Dateien und Architektur

| Datei                                 |       Umfang | Verantwortung                                                                    | Nachweis                                             |
| ------------------------------------- | -----------: | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `index.html`                          | 2.503 Zeilen | vollständige Seite, Formular, Beispieldaten, Modale sowie mehrere Inline-Skripte | gesamter Dateiaufbau; Scriptreihenfolge Z. 2247–2252 |
| `styles.css`                          |   701 Zeilen | Bootstrap-Overrides, Theme, Komponenten- und Fachstile                           | Z. 1–701                                             |
| `form.js`                             | 1.005 Zeilen | Rollen, Anzeigename, dynamische Einträge, Autocomplete, Export, Scrollspy, Reset | u. a. Z. 1–214, 338–536, 713–1005                    |
| `edtf-component.js`                   |   842 Zeilen | EDTF-Datum, Intervalle, Listen, Modale, Chronologie                              | Klassen ab Z. 202, 438 und 539                       |
| `validation.js`                       |   125 Zeilen | Feld- und Formularvalidierung                                                    | `validateField`, `validateForm`                      |
| `theme.js`                            |    41 Zeilen | Hell-/Dunkelmodus und `localStorage`                                             | Z. 6–37                                              |
| `autocomplete-data.js`                |   194 Zeilen | statische Vorschlagsdaten                                                        | vollständige Datei                                   |
| `person-form-lookfeel.code-workspace` |     7 Zeilen | lokale Editor-Konfiguration                                                      | vollständige Datei                                   |

Es gibt keine Paketdatei, keinen Bundler, keinen Compiler und keinen Node.js-Buildschritt. Die Seite ist direkt als statisches Dokument oder über GitHub Pages ausführbar.

### 4.2 Externe und lokale Abhängigkeiten

| Abhängigkeit             | Version/Quelle                          | Verwendung                                                                  | Ausfallwirkung                                                       |
| ------------------------ | --------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Bootstrap CSS            | 5.3.2, jsDelivr                         | Grid, Utilities, Forms, Cards, Buttons, Alerts, Tabellen, Modale, Accordion | wesentliche Gestaltung fällt aus                                     |
| Bootstrap Bundle         | 5.3.2, jsDelivr                         | Modal, Collapse, Scrollspy; Popper ist enthalten                            | Modale, Accordion und Scrollspy fallen aus                           |
| Bootstrap Icons          | 1.11.1, jsDelivr                        | 72 statische `<i class="bi …">` plus dynamische Icons                       | Icons fehlen, einige Icon-Buttons verlieren ihre sichtbare Bedeutung |
| `edtf`                   | 4.11.0, dynamischer ESM-Import          | EDTF-Parsing und -Validierung                                               | EDTF-Komponente zeigt Fehlermeldung statt Eingabe                    |
| Marker.io                | `edge.marker.io`, nur außerhalb `file:` | Demo-Feedback                                                               | fachliches Formular bleibt nutzbar                                   |
| lokale Favicons/Manifest | übergeordnetes `docs`-Verzeichnis       | Branding/PWA-Metadaten                                                      | keine Formularfunktion betroffen                                     |

**Bestand:** `index.html:8–14`, `index.html:15–28`, `index.html:2247–2252`, `edtf-component.js:1–2`, `edtf-component.js:837–841`.

**Progressive Enhancement:** nur teilweise vorhanden. Ohne JavaScript bleiben viele statische Eingaben und Beispieldaten sichtbar, aber Rollensteuerung, dynamische Felder, Autocomplete, Anzeigename, EDTF-Eingabe, JSON-Export, Reset, Themeumschaltung und Bootstrap-Interaktionen funktionieren nicht. Da EDTF-Hosts ihr Bedien-Markup erst per JavaScript erhalten, ist die Kernfunktion der Datumsbearbeitung ohne JavaScript nicht verfügbar. Ein vollständig funktionsfähiger No-JS-Modus ist derzeit nicht vorgesehen.

### 4.3 Browseranforderungen

Der Bestand nutzt unter anderem `:has()`, Container Queries, `inert`, `hidden`, `classList`, `toggleAttribute`, `queueMicrotask`, dynamische ES-Module, optionale Verkettung und `Object.fromEntries`. Zielbrowser müssen aktuelle Evergreen-Versionen von Chromium, Firefox und Safari sein. Für institutionell verwaltete Altbrowser ist vor der Migration eine eigene Supportentscheidung erforderlich.

### 4.4 Seiten- und Layoutstruktur

- flüssiger Bootstrap-Container (`index.html:33`);
- zentrierte Bootstrap-Zeile mit Hauptinhalt und Sidebar (`index.html:35–37`, `index.html:1804–1842`);
- Hauptinhalt per Inline-Style auf `800px` begrenzt (`index.html:37`);
- 13 Hauptabschnitte mit `.form-section` und überwiegend `.card` (`index.html:65–1664`);
- Sticky-Sidebar mit vertikaler Abschnittsnavigation und Aktionen (`styles.css:147–177`, `index.html:1804–1842`);
- Scrollspy über Datenattribute und zusätzliche Initialisierung (`index.html:43`, `form.js:934–940`);
- ein klassischer Breakpoint bei `575.98px` (`styles.css:462–469`);
- eine Container Query bei `62rem` (`styles.css:471–486`).

Die Container Query ist im aktuellen Layout unerreichbar: Der beobachtete Container kann wegen `max-width: 800px` keine `62rem` beziehungsweise ungefähr `992px` erreichen. Die vorgesehene Zweispaltigkeit von Geburt und Tod tritt daher nicht ein.

## 5. Vollständige Komponenten- und Pattern-Inventur

### 5.1 Formularelemente

| Komponente      | Bestand und Varianten                                                                   | Fundstelle                                                          | Zustände/Interaktion                                           | Probleme                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Text Input      | 37 statische Inputs; Standard, URL/ID, Telefonnummer, Ortsfeld, readonly, hidden-backed | `index.html`, u. a. Z. 224–242, 351–583, 621–637, 1176–1201         | leer, befüllt, disabled, readonly, valid/invalid, `.has-value` | keine einheitliche Breitenlogik; befüllt wird pauschal grün markiert                                     |
| E-Mail/Tel      | 1 E-Mail-, 3 Tel-Inputs                                                                 | Kontakt, Z. 1176–1201                                               | Lebensstatus- und einwilligungsabhängig                        | Kontaktbereich vollständig von Rollen-/Statuslogik abhängig                                              |
| Select          | 2 statische Selects sowie dynamischer EDTF-Endzustand                                   | Quelle, Z. 1900 ff.; `EdtfIntervalInput.configureEndModal`          | change, required, conditional disclosure                       | Varianten nicht als gemeinsame Komponente dokumentiert                                                   |
| Radio Group     | Rollenwahl, Lebensstatus, Geschlecht                                                    | Z. 82–124, 151–176, 245–264                                         | selected, disabled, rollenabhängig                             | Rollen- und Lebensstatusgruppen ohne `fieldset`/`legend`; Lebensstatus versteckt native Controls visuell |
| Checkbox        | Einwilligung                                                                            | Kontakt, Z. 1160 ff.                                                | change, disabled                                               | fachliche Folgefelder werden per JS gesteuert                                                            |
| Textarea        | 7 statische Textareas; Kommentar, Notiz, Quelle, Beschreibung, Import-Raw               | u. a. Z. 1185 ff., 1857 ff., 1878 ff., 1790 ff.                     | editable, readonly, hidden                                     | keine gemeinsame Größen-/Resize-Regel                                                                    |
| Fieldset/Legend | ausschließlich dynamisch in EDTF                                                        | `EdtfDateInput`, `EdtfIntervalInput.render`, Z. 229 ff. und 555 ff. | gruppiert Datumsmasken                                         | statische Radio-Gruppen verwenden keine Fieldsets                                                        |
| Label           | 61 statische Labels, überwiegend `.form-label`                                          | gesamtes Formular                                                   | gedämpft bei benachbartem disabled Control                     | `:has()`-Selektoren decken nur bestimmte DOM-Formen ab                                                   |
| Hilfetext       | `.form-text`, `<small>`, Lead-Text, Alert                                               | zahlreiche Abschnitte                                               | statisch                                                       | vier visuelle Muster für ähnliche Erläuterungen                                                          |
| Validation      | `.invalid-feedback`, `.is-valid`, `.is-invalid`, EDTF-Live-Region                       | `validation.js:37–61`, `edtf-component.js:268–286`                  | blur/input/submitähnliche Prüfung                              | kein Fehler-Summary; positive Validierung und `.has-value` konkurrieren visuell                          |

### 5.2 Struktur-, Anzeige- und Navigationskomponenten

| Komponente           | Bestand und Varianten                                                                 | Fundstelle                                                      | Abhängigkeit                      | Probleme                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| Section Container    | 13 `.form-section > .card`                                                            | `index.html:65–1664`                                            | Bootstrap Card + eigene Stile     | äußeres Muster stabil, aber innere Karten werden inflationär verschachtelt                         |
| Card                 | 38 statische Vorkommen; Abschnitt, Tätigkeit, Wirkungsort, Quelle, Kommentar, Sidebar | u. a. Z. 66, 665–779, 865–1138, 1218–1350, 1385–1528, 1805      | Bootstrap                         | gleiche visuelle Ebene für fachlich ungleiche Inhalte                                              |
| Unterabschnitt       | `.form-subsection`, `.row-separator`, innere Card, Heading plus Margin                | Lebensdaten Z. 611–648; Identität Z. 222 ff.; übrige Abschnitte | eigenes CSS/Utilities             | mehrere konkurrierende Muster für dieselbe Gruppierungsfunktion                                    |
| Datenzeile           | `.compact-value-grid`, `.source-detail-list`, Badges, Plaintext, Alert                | Lebensdaten, Quellen, Anzeigename                               | eigenes CSS + Bootstrap           | uneinheitliche Label-Wert-Aktionsanatomie                                                          |
| Repeatable List      | EDTF-Liste, Tätigkeiten, Wirkungsorte, Quellen, Notizen, Dynamic Field Rows           | `EdtfDateList`; `form.js:338–536`; statisches Markup            | Vanilla JS + Bootstrap            | mindestens fünf verschiedene Eintragsanatomien                                                     |
| Navigation           | Sticky Sidebar, 13 Anchor-Links, aktive Scrollspy-Markierung                          | `index.html:1817–1830`, `styles.css:147–174`                    | Bootstrap Scrollspy + eigenes CSS | mobil kein eigenes Navigationsmuster; Demo- und Formularaktionen vermischt                         |
| Breadcrumb/Back Link | pillenförmiger Link „Back to Demos“                                                   | `index.html:38–41`                                              | Bootstrap Button                  | kein Breadcrumb; Sprache und Form passen nicht zum Formular                                        |
| Accordion/Collapse   | ein Normdaten-Accordion                                                               | `index.html:434–449`                                            | Bootstrap Collapse                | semantische Überschrift `h2` bricht Dokumenthierarchie; ohne JS geschlossen                        |
| Modal/Dialog         | 6 statische Modale plus dynamische EDTF-Modale                                        | `index.html:1850–2241`; `EdtfDateInput.render`                  | Bootstrap Modal                   | mehrere englische Labels; starke Bootstrap-JS-Abhängigkeit; transaktionale EDTF-Logik ist wertvoll |
| Tabelle              | Record History                                                                        | `index.html:1555–1655`                                          | Bootstrap Table/Responsive        | fachlich tabellarisch korrekt; Zeitangaben/Statusbadges uneinheitlich                              |
| Description List     | Quellendetails                                                                        | `index.html:1300 ff.`, `.source-detail-list`                    | eigenes CSS                       | jeder Wert wird erneut wie eine Karte eingerahmt                                                   |
| Alerts/Notices       | Info, Erfolg, Datenanzeige, Ladefehler                                                | `index.html:75`, `129`, `194`, `1370`; EDTF-Fallback            | Bootstrap + Overrides             | Alerts werden zugleich für Status, Erklärung und normalen Datenwert verwendet                      |
| Badges/Chips         | 60 statische Badges: Demo-Tags, Rollen, Tätigkeit, Ort, Historie, Status              | gesamtes Dokument                                               | Bootstrap + Farbutilities         | zu viele Bedeutungen und Farben; pillenförmige Dekoration dominiert                                |
| Icon Buttons         | Bearbeiten, Löschen, Hilfe, Theme, History-Info                                       | statisch und dynamisch                                          | Bootstrap Icons                   | mehrere dynamische und statische Buttons ohne konsistenten zugänglichen Namen                      |
| Tooltip              | CSS-Pseudoelement an Zeitstempeln                                                     | `.created-timestamp`, `styles.css:661–700`                      | eigenes CSS                       | nur Hover/Focus, Inhalt doppelt in `aria-label`; kein allgemeines Tooltippattern                   |
| Empty State          | `.form-empty-state`, Gedankenstrich, versteckter Block, Plaintext                     | Lebensdaten und andere Abschnitte                               | eigenes CSS/Utilities             | „nicht vorhanden“, „unbekannt“ und „nicht anwendbar“ nicht systematisch unterschieden              |
| Status/Loading       | Validierungsstatus und EDTF-Ladefehler                                                | `validation.js`; `edtf-component.js:837–841`                    | eigenes JS                        | kein regulärer Lade-/Skeletonzustand; für statischen synchronen Bestand derzeit nicht benötigt     |
| Aktionsbereich       | Sidebar-Aktionen, Card-Header-Aktionen, Inline-Aktionsspalte, Modal-Footer            | u. a. Z. 1832 ff.; `.edtf-edit-action`; Modale                  | Bootstrap + eigenes CSS           | Größe, Position, Text/Icon-Verhältnis und Hierarchie wechseln                                      |
| Tabs                 | nicht gefunden                                                                        | —                                                               | —                                 | derzeit kein nachgewiesener Bedarf                                                                 |
| Side Panel/Drawer    | nicht gefunden                                                                        | —                                                               | —                                 | nicht als Ersatz für Dialoge einführen, bevor ein fachlicher Bedarf belegt ist                     |
| Suchfeld/Filter      | nicht gefunden                                                                        | —                                                               | —                                 | im Personenformular aktuell kein Bestand; für spätere Listenansichten fachlich zu spezifizieren    |
| Popover              | nicht gefunden                                                                        | —                                                               | —                                 | kein Bedarf belegt                                                                                 |
| Aktionsmenü          | nicht gefunden                                                                        | —                                                               | —                                 | erst bei nachgewiesener Aktionsdichte ergänzen                                                     |

Ebenfalls ausdrücklich **nicht gefunden** wurden eine eigenständige Button Group (`.btn-group`), Breadcrumb-Navigation, allgemeine Panel-Komponente, native oder eigene Tabs, ein Side Panel/Drawer, ein regulärer Ladeindikator, eine eigenständige Statusanzeige außerhalb von Badges/Validierung sowie eine allgemein verwendbare Inline-Notice-Komponente außerhalb der Bootstrap-Alerts. Der einzelne pillenförmige „Back to Demos“-Link ist ein Back Link, kein Breadcrumb. Die Lebensstatusoptionen sind eine Radio Group, keine Button Group. Diese fehlenden Komponenten werden nicht allein zur Vervollständigung eines Katalogs eingeführt.

### 5.3 Fachliche Komponenten

| Fachkomponente         | Fundstelle                                                           | Funktion                                                  | Bewertung                                                                              |
| ---------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Rollen-Gate            | `index.html:65–138`, `form.js:1–214`                                 | Demo-Auswahl und UI-Berechtigungen                        | funktional erhalten; als Demo-Werkzeug aus der fachlichen Hierarchie herauslösen       |
| Lebensstatus-Gate      | `index.html:141–181`, `form.js:543–604`, `edtf-component.js:803–828` | Datenschutz-/Feldlogik und Sterbedatum                    | erhalten und semantisch als Radio Group modernisieren                                  |
| Anzeigename            | `index.html:184–212`, `form.js:216–336`                              | berechnete Identitätsanzeige                              | Alert als normaler Datencontainer ersetzen; Berechnungslogik erhalten                  |
| Normdaten              | `index.html:345–602`                                                 | IDs, Links, erweiterte Register                           | flache Property-Liste plus Disclosure; externe Links klar kennzeichnen                 |
| EDTF-Datum             | `EdtfDateInput`                                                      | Level-1-Datum mit Interpretation und Dialogbearbeitung    | übernehmen und visuell vereinheitlichen; externe ESM-Abhängigkeit absichern            |
| EDTF-Intervall         | `EdtfIntervalInput`                                                  | Beginn/Ende/offener Zeitraum und Chronologie              | übernehmen; verschachtelte Rahmen reduzieren                                           |
| Weitere Lebensdaten    | `EdtfDateList`                                                       | wiederholbare kontextlose Datumsangaben                   | Referenz für neutrales Repeatable-List-Muster                                          |
| Tätigkeiten/Rollen     | `index.html:652–853`, `form.js:338–453`                              | wiederholbare Tätigkeit mit Institution, Zeitraum, Rollen | vereinheitlichen; statische Darstellungs- und Editiermuster derzeit vermischt          |
| Wirkungsorte           | `index.html:854–1153`, `form.js:455–536`                             | Ort, Institution, Rolle, Zeitraum, Beschreibung           | mit Tätigkeiten fachlich abgleichen; flache Einträge statt Cards                       |
| Quellen                | `index.html:1210–1363`, Source-Modal Z. 1892 ff.                     | Quellenmetadaten und Zotero-Bezug                         | Property- und Repeatable-Muster verwenden; Dialoglogik erhalten                        |
| Kommentare/Notizen     | `index.html:1364–1543`                                               | redaktionelle Diskussion und Anmerkungen                  | threadartige Struktur erhalten, Karten und Badge-Dichte reduzieren                     |
| Record History         | `index.html:1545–1661`                                               | Audit-Trail                                               | Tabelle beibehalten; technische Begriffe, Datumsformat und Statusvokabular klären      |
| Importdaten            | `index.html:1662–1801` und Inline-Skripte ab Z. 2253                 | Rohdaten und JSON-LD                                      | klar als administrativer/technischer Bereich abgrenzen; Monospace nur für Rohdaten     |
| Rollen-/Viewer-Zustand | `form.js:26–214`, `validation.js:87–93`                              | Sichtbarkeit, Read-only, Export-/Reset-Sperre             | bestehende Clientlogik erhalten, aber nicht als produktive Zugriffskontrolle behandeln |

## 6. CSS- und Token-Inventur

### 6.1 Bestehende Variablen und Werte

`styles.css:2–17` und `98–111` überschreiben Bootstrap-Variablen für Rahmen, Text, Primär-, Erfolgs-, Gefahren-, Muted-, Sekundär- und Seitenhintergrund. Es gibt keinen eigenen neutralen Token-Namespace. Dadurch sind Framework-API und Produktdesign gekoppelt.

Weitere direkt kodierte Werte:

- Farbvarianten für acht Background-Utilities (`styles.css:19–51`);
- acht Alert-Varianten (`styles.css:53–96`);
- Grünmarkierung befüllter Inputs (`styles.css:120–129`);
- Navigation, Overlay und Disabled-Labels (`styles.css:147–239`);
- Lebensstatusfarben (`styles.css:299–358`);
- Buttonfarben und Schatten (`styles.css:488–579`);
- JSON-Syntaxfarben (`styles.css:581–601`);
- Quellen- und Tooltipfarben (`styles.css:631–700`).

### 6.2 Typografie

- keine eigene Schriftart; Bootstrap-Systemfont wird geerbt;
- Monospace für EDTF-Output und JSON (`styles.css:242–244`, `582–594`);
- Unterabschnitt 18px/600 (`styles.css:391–397`);
- Kompaktlabel 14px/500 (`styles.css:432–436`);
- Quellendetail-Label 12,48px/600 mit Letterspacing (`styles.css:636–641`);
- zahlreiche Bootstrap-Typografieutilities (`h5`, `fs-*`, `fw-*`, `small`, `lead`).

Die semantische Überschriftenfolge ist inkonsistent: Seitentitel `h4`, Hauptabschnitte `h3`, Normdaten-Accordion `h2`, interne Einträge `h6`, Modale `h5`. Visuelle und semantische Ebene sind vermischt.

### 6.3 Spacing, Radien, Schatten und Größen

- Spacing überwiegend über Bootstrap-Utilities (`mb-*`, `mt-*`, `p-*`, `gap-*`, `g-*`);
- eigene Abstände reichen von `0.15rem` bis `2rem` ohne benannte Skala;
- Radien mindestens `0.35rem`, `0.375rem`, `0.5rem`, `0.65rem`, `0.75rem` und `rounded-pill`;
- Schatten für Inputs, Dropdown, Lebensstatus, Button-Hover, Cards und Quellendetails;
- Aktionsgrößen: EDTF `2.25rem`, Wirkungsort mindestens `2.4rem`, sonst Bootstrap `btn-sm` oder Standard;
- Ortsfelder erzwingen `3rem` Mindesthöhe (`styles.css:443–445`);
- Autocomplete-Dropdown: `200px` Maximalhöhe und `z-index:1000`;
- Disabled-Overlay: `z-index:5`; Tooltip: `z-index:10`.

### 6.4 Responsive Regeln

Eigene responsive Regeln existieren nur für das Lebensdatenraster unter 576px und für die unerreichbare Container Query ab 62rem. Das übrige Layout verlässt sich auf Bootstrap-Breakpoints in Klassen wie `col-md-*`, `col-lg-*`, `col-xl-*`. Tabletbreiten, mobile Navigation, Modalbreiten und lange wissenschaftliche Werte besitzen keine formularweite Regel.

### 6.5 Spezifität, Overrides und technische Schulden

- 51 Vorkommen von `!important`, vor allem in Bootstrap-Overrides;
- globale Überschreibung von `.bg-*`, `.alert-*`, `.btn*`, `.card`, `.table`, `.form-control`;
- komplexe `label:has(+ …:disabled)`-Selektoren (`styles.css:217–233`);
- Inline-Styles in `index.html`, besonders `max-width:800px` und ein `display:none!important`;
- fachliche Klassen (`.wirkungsort-*`) neben neutralen Komponentenklassen (`.form-subsection`, `.repeatable-entry`);
- Kommentar „Row separators for Lebensdaten“ beschreibt `.row-separator`, obwohl die Klasse in Identität verwendet wird;
- Tippfehler `alert-sec ondary` in `index.html:194` verhindert die beabsichtigte Alertvariante;
- weiße Schrift auf den hellen Pastellflächen der gefüllten Buttons und Lebensstatusoptionen erzeugt zu geringen Kontrast (`styles.css:325–353`, `499–513`).

## 7. Interaktionsinventur

| Interaktion           | Auslöser                                             | Ziel/Zustandsänderung                                                    | Abhängigkeit                                | Accessibility/No-JS                                                                                                                 |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Rollenwechsel         | `change` auf `userrolle`                             | Sections/Nav sichtbar, hidden, inert, disabled; Vieweraktionen verborgen | `form.js:1–214`                             | Viewerzustand ist restriktiver, aber rein clientseitig; ohne JS keine Rechtewirkung                                                 |
| Lebensstatuswechsel   | `change`                                             | Felder/Abschnitte, Kontakt, Sterbedatum und Viewerfreigaben              | `form.js:199–209`, 543–604; EDTF Z. 803–828 | Löschbestätigung per `confirm`; ohne JS keine Gate-Logik                                                                            |
| Anzeigename           | `input`                                              | berechneter Name und Metazeile im Formular/Sidebar                       | `form.js:216–336`                           | Ausgabe visuell; kein eigener Live-Status nötig, da nicht handlungskritisch                                                         |
| Feldvalidierung       | `blur`, `input`, Formularprüfung                     | `.is-valid`/`.is-invalid`, Feedbacktext                                  | `validation.js:37–125`                      | Feedback am Feld; kein Error Summary/Fokusmanagement                                                                                |
| EDTF-Bearbeitung      | Modal öffnen, Eingaben, Anwenden/Abbrechen/Entfernen | transaktionaler Snapshot, Canonical Value, Interpretation, Fehler        | Bootstrap Modal + EDTF.js                   | Live-Region und `aria-invalid`; Fokus durch Bootstrap; ohne JS nicht verfügbar                                                      |
| EDTF-Liste            | Hinzufügen/Bearbeiten/Entfernen                      | DOM-Eintrag und Empty State                                              | `EdtfDateList`                              | zugängliche Aktionsnamen; Fokus nach Hinzufügen nicht vollständig dokumentiert                                                      |
| Tätigkeit/Wirkungsort | Add-/Remove-Buttons                                  | dynamische Cards/Rows, Autocomplete, EDTF-Initialisierung                | Vanilla JS                                  | teils Inline-Handler; einige dynamische Trash-Icons ohne `aria-label`                                                               |
| Autocomplete          | input, focus, blur, keydown                          | Dropdown, aktive Option, Auswahl                                         | `initAutocomplete`, `form.js:713–803`       | Pfeile/Enter/Escape vorhanden; kein Combobox-ARIA-Modell (`role=combobox/listbox/option`, `aria-expanded`, `aria-activedescendant`) |
| Accordion             | click/keyboard auf Bootstrap-Button                  | Normdatenbereich auf/zu                                                  | Bootstrap Collapse                          | Button-ARIA vorhanden; ohne JS nicht aufklappbar                                                                                    |
| Navigation/Scrollspy  | Scroll/Anchorclick                                   | aktive Sidebar-Markierung                                                | Bootstrap Scrollspy                         | native Anker bleiben ohne JS nutzbar                                                                                                |
| Theme                 | Buttonclick                                          | `data-bs-theme`, Icon und `localStorage`                                 | `theme.js`                                  | Themezustand sollte textuell/mit `aria-pressed` kenntlich sein; ohne JS hell                                                        |
| JSON-Export           | Buttonclick                                          | Formularserialisierung und Download                                      | `collectPersonFormData`, `form.js:835–932`  | Viewer wird geblockt; versteckte DOM-Daten bleiben clientseitig vorhanden                                                           |
| Reset                 | Buttonclick + Confirm                                | Form, dynamische Listen, Validierung und Gates zurücksetzen              | `form.js:942–1005`                          | Viewer wird geblockt; Browserdialog statt eigener Dialog                                                                            |
| Quellenmodal          | Change/Shown/Hidden/Save                             | bedingte Zotero-Felder, Fokus, Dummy-Payload                             | Inline-Script `index.html:2421–2496`        | `reportValidity`; mehrere englische Labels                                                                                          |
| Zeitstempeltooltip    | hover/focus-visible                                  | CSS-Pseudoinhalt                                                         | `styles.css:661–700`                        | tastaturerreichbar nur wenn Ursprung fokussierbar; nicht überall garantiert                                                         |

Hover, Active und Selected sind überwiegend Bootstrap- oder komponentenspezifisch. Ein globaler `:focus-visible`-Standard fehlt. Schutz vor Datenverlust besteht punktuell durch `confirm`, nicht formularweit bei Navigation oder ungespeicherten Änderungen. Einen Ladezustand gibt es nur als EDTF-Ausfallmeldung.

## 8. Bewertung des Bestands

Nur die vereinbarten Aktionskategorien werden verwendet.

| Bestand/Muster                      | Aktion           | Fachliche Begründung                                               | Technische Begründung                                                             | Gestalterische Begründung                            |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| statische HTML-/CSS-/JS-Architektur | übernehmen       | erfüllt Demo- und Verteilungsbedarf                                | kein Buildzwang, geringe Einstiegshürde                                           | unabhängig vom visuellen Ziel                        |
| Bootstrap als Ganzes                | modernisieren    | bestehende Funktionen müssen stabil bleiben                        | selektive Entkopplung statt Big Bang                                              | Frameworklook durch eigene Komponenten reduzieren    |
| äußere Hauptabschnitte              | vereinheitlichen | fachliche Kapitel bleiben notwendig                                | gemeinsames Section-Pattern                                                       | klare Ebene ohne zusätzliche Innenkarten             |
| Bootstrap Grid/Utilities            | übernehmen       | bewährte Feldanordnung                                             | weit verbreitet im Markup; geringer unmittelbarer Nutzen eines Austauschs         | später nur bei konkretem Layoutbedarf ablösen        |
| verschachtelte Cards                | vereinfachen     | Einträge bleiben unterscheidbar                                    | weniger Markup/Overrides                                                          | Typografie, Abstand und Trenner statt Card-in-Card   |
| Lebensdaten-Unterabschnitt          | übernehmen       | fachlich klar                                                      | bereits neutralisierte Klassen                                                    | beste vorhandene Referenz, nach Responsive-Korrektur |
| Repeatable-Patterns                 | vereinheitlichen | Tätigkeiten, Orte, Quellen und Daten folgen demselben Grundprinzip | gemeinsame DOM-Anatomie und JS-Hooks                                              | konsistente Aktionsspalte und Leerzustände           |
| Alerts als Datenanzeige             | ersetzen         | normaler Wert ist kein Alarm                                       | semantisch unpassendes `role=alert`                                               | reduziert Farb- und Rahmendichte                     |
| Badgevielfalt                       | vereinfachen     | nur echte Status/Taxonomien brauchen Chips                         | weniger globale Farbutilities                                                     | weniger dekorative Pills und Farbrauschen            |
| native Form Controls                | übernehmen       | vertraut und barrierearm                                           | robust, ohne Zusatzbibliothek                                                     | shadcn-artige Ausgewogenheit durch eigenes CSS       |
| Radio-Gruppen ohne Fieldset         | modernisieren    | Frage und Optionen gehören zusammen                                | native Semantik ergänzen                                                          | Hierarchie durch Legend statt Cardtitel              |
| Autocomplete                        | modernisieren    | fachlich nötig                                                     | WAI-ARIA-Comboboxverhalten ergänzen                                               | Dropdown an Tokens ausrichten                        |
| Bootstrap Accordion                 | ersetzen         | einfache Offenlegung genügt                                        | `<details>/<summary>` kann ohne JS arbeiten, sofern nur ein Bereich betroffen ist | ruhiger und leichter                                 |
| Bootstrap Modale                    | übernehmen       | komplexe transaktionale Bearbeitung vorhanden                      | Ersatz aller Modale ist riskant; Fokusfalle bereits gelöst                        | zunächst nur Styling/Anatomie vereinheitlichen       |
| Scrollspy                           | übernehmen       | lange Form profitiert von Orientierung                             | vorhandene Bootstrap-Funktion robust                                              | Navigation visuell modernisieren                     |
| `.disabled-section`-Overlay         | ersetzen         | Rechte und Nichtverfügbarkeit müssen eindeutig sein                | Controls tatsächlich steuern; Overlay allein ist unzureichend                     | kein milchiger Blur über Daten                       |
| befüllt = grün                      | entfernen        | Inhalt ist nicht automatisch gültig                                | kollidiert mit Validation                                                         | Farbe nur für Bedeutung einsetzen                    |
| Hell-/Dunkelmodus                   | modernisieren    | vorhandene Nutzerfunktion                                          | Variablen bereits angelegt                                                        | semantische Tokens statt duplizierter Direktwerte    |
| Record-History-Tabelle              | übernehmen       | Daten sind tabellarisch                                            | semantisch korrekt                                                                | kompakte Tabelle passt zum Zielbild                  |
| Demo-Rollenwahl im Formular         | ersetzen         | keine fachliche Personeneigenschaft                                | als separate Demo-Toolbar                                                         | trennt Entwicklungswerkzeug und Anwendung            |
| Error Summary                       | neu ergänzen     | lange Form braucht Fehlerübersicht                                 | Links/Fokus zu fehlerhaften Feldern                                               | GOV.UK-/USWDS-Kontrollmuster                         |
| Dirty-State/Verlassensschutz        | neu ergänzen     | Datenverlust bei langer Erfassung vermeiden                        | kleines unabhängiges JS-Modul                                                     | keine neue visuelle Komponente außer Statushinweis   |

## 9. Zielbild und Referenzgewichtung

Die Referenzen werden nicht kopiert und nicht technisch eingebunden.

- **Linear:** geringe visuelle Reibung, kompakte Navigation, Listen, klare aktive Zustände, wenig dekorative Container.
- **Vercel Geist:** präzise Typografie, ruhige Formabschnitte, klare administrative Einstellungen, reduzierte Oberflächen.
- **Notion:** Property-artige Label-Wert-Strukturen, Beziehungen, Metadaten und redaktionelle Inhalte mit zurückhaltender Rahmung.
- **shadcn/ui:** nachvollziehbare Komponentenanatomie, Größen, Varianten und Zustände; keine React- oder Tailwind-Übernahme.
- **GOV.UK und USWDS:** verständliche Labels, Fieldset/Legend, feldnahe Fehler, robuste Fokuszustände, Tastaturreihenfolge und Accessibility als Kontrollmaßstab.

Produktstil: sachlich, wissenschaftlich, ruhig, kompakt, präzise. Akzentfarbe unterstützt Navigation, Fokus und Primäraktion; sie dekoriert keine normalen Datenwerte.

## 10. Zielarchitektur

Die CSS- und Komponentenarchitektur wird in dieser Reihenfolge aufgebaut:

1. `tokens`: semantische CSS Custom Properties für Farbe, Typografie, Raum, Größe, Radius, Schatten, Motion und Ebenen;
2. `base`: Box-Sizing, Dokumenttypografie, Links, Fokus und Form-Grundelemente;
3. `layout`: Container, Stack, Cluster, Grid, Sidebar und Split;
4. `components`: Button, Field, Section, Notice, Chip, Data Row, Repeatable List, Dialog, Disclosure, Table, Empty State;
5. `domain`: EDTF, Normdaten, Beziehungen, Quellen, Rollen, Audit und Import;
6. `states`: `[hidden]`, `[aria-invalid]`, `[aria-disabled]`, readonly, selected, loading;
7. `utilities`: kleine, dokumentierte Ausnahmehilfen;
8. seitenspezifische Regeln nur bei nachgewiesenem Bedarf.

Die Dateien können anfangs physisch zusammenbleiben. Die Schichten müssen zuerst durch Reihenfolge und Kommentare in `styles.css` erkennbar werden; eine Aufteilung in mehrere CSS-Dateien erfolgt nur, wenn sie Wartung messbar verbessert.

JavaScript wird schrittweise in unabhängige Verantwortlichkeiten getrennt: `permissions`, `life-status`, `display-name`, `validation`, `autocomplete`, `repeatable-list`, `edtf`, `theme`, `export`, `dirty-state`. Bestehende globale Eventnamen werden dokumentiert und nur kontrolliert geändert.

## 11. Design-Tokens

Die folgenden Tokens sind Zielwerte für den ersten Pilot. Sie leiten sich aus den vorhandenen kühlen Grautönen und der blauen Akzentidee ab, reduzieren aber Pastell- und Statusrauschen. Kontrastwerte sind vor Implementierung automatisiert gegen WCAG 2.2 AA zu prüfen.

```css
:root {
  color-scheme: light;

  --color-background: #f7f8fa;
  --color-surface: #ffffff;
  --color-surface-subtle: #f3f5f7;
  --color-surface-raised: #ffffff;
  --color-text: #182026;
  --color-text-muted: #66717b;
  --color-text-subtle: #7d8790;
  --color-border: #d9dfe5;
  --color-border-strong: #b8c1ca;
  --color-accent: #2563a6;
  --color-accent-hover: #1f548e;
  --color-accent-subtle: #eaf2fb;
  --color-focus: #0b6bcb;
  --color-success: #237a45;
  --color-success-subtle: #e9f6ee;
  --color-warning: #8a5a00;
  --color-warning-subtle: #fff5d8;
  --color-danger: #b42336;
  --color-danger-subtle: #fcecef;
  --color-info: #235f82;
  --color-info-subtle: #eaf4f8;

  --font-sans:
    system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --line-height-tight: 1.3;
  --line-height-normal: 1.5;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --border-width: 1px;
  --shadow-raised: 0 1px 2px rgb(16 24 40 / 0.06);
  --shadow-dialog: 0 16px 48px rgb(16 24 40 / 0.18);

  --control-height-sm: 2rem;
  --control-height-md: 2.5rem;
  --control-height-lg: 3rem;
  --icon-button-size: 2.25rem;
  --content-width-form: 70rem;
  --content-width-reading: 48rem;
  --sidebar-width: 15rem;

  --breakpoint-sm: 36rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --z-sticky: 20;
  --z-dropdown: 100;
  --z-dialog: 1000;
  --z-tooltip: 1100;
}

[data-theme="dark"],
[data-bs-theme="dark"] {
  color-scheme: dark;
  --color-background: #0f1317;
  --color-surface: #151a1f;
  --color-surface-subtle: #1b2127;
  --color-surface-raised: #1d232a;
  --color-text: #f0f3f5;
  --color-text-muted: #a9b2ba;
  --color-text-subtle: #87929c;
  --color-border: #343d46;
  --color-border-strong: #4b5661;
  --color-accent: #75aee8;
  --color-accent-hover: #91bff0;
  --color-accent-subtle: #182b3e;
  --color-focus: #8bc4ff;
}
```

Bootstrap-Variablen werden während der Übergangszeit aus diesen Produkttokens abgeleitet, nicht umgekehrt.

## 12. Typografie und visuelle Hierarchie

| Ebene               | Semantik                       | Zielstil       | Regel                                        |
| ------------------- | ------------------------------ | -------------- | -------------------------------------------- |
| Seitentitel         | `h1`                           | 24px/600       | genau einmal pro Seite                       |
| Hauptabschnitt      | `h2`                           | 20px/600       | Identität, Lebensdaten, Quellen usw.         |
| Unterabschnitt      | `h3` oder `legend`             | 18px/600       | Geburt, Tod, fachliche Gruppen               |
| Eintragsüberschrift | `h4` falls echte Unterstruktur | 16px/600       | nicht für jedes Feld verwenden               |
| Feldlabel           | `label`                        | 14px/500       | sichtbar und eindeutig mit Control verknüpft |
| Feldwert            | passendes Element              | 14–16px/400    | Monospace nur für Codes/IDs/Rohdaten         |
| Hilfe/Metadaten     | `small`, Beschreibung          | 14px/400 muted | direkt beim zugehörigen Feld                 |

Überschriften dürfen nicht zur Auswahl einer gewünschten Schriftgröße missbraucht werden. Normale Eigenschaften erhalten keine Überschrift. Trennlinien stehen zwischen Inhaltsgruppen, nicht unmittelbar als Unterstreichung unter jeder Überschrift.

## 13. Spacing, Layout und responsive Verhalten

- Label zu Control/Hilfe: `--space-2`;
- Felder innerhalb einer Gruppe: `--space-4` oder `--space-6`;
- Untergruppen: `--space-8`;
- Hauptabschnitte: `--space-10` bis `--space-12`;
- eine äußere Begrenzung pro Hauptabschnitt; keine Card pro Eintrag;
- Aktionsspalten besitzen eine feste Breite von mindestens `--icon-button-size`;
- Formularcontainer auf großen Arbeitsflächen bis `--content-width-form`, nicht pauschal 800px;
- lange Textwerte und IDs dürfen umbrechen; Code nutzt `overflow-wrap:anywhere`;
- zweispaltige fachliche Gruppen nur, wenn jeder Teil mindestens 30rem nutzbare Breite erhält;
- mobile Reihenfolge entspricht immer der DOM-Reihenfolge;
- Sidebar bleibt ab großer Inhaltsbreite sticky; darunter wird sie zu einer kompakten In-Page-Navigation oder einem nativen Disclosure;
- kein horizontaler Seitenüberlauf bei 320px, 375px, 768px, 1024px, 1280px und 1440px Viewportbreite.

Für Geburt und Tod gilt: Solange der Formularcontainer nicht mindestens rund 64rem nutzbare Inhaltsbreite besitzt, bleiben beide Gruppen untereinander. Die bisherige Container Query wird erst nach Entfernung der 800px-Begrenzung aktiviert oder bewusst gestrichen.

## 14. Formulargestaltung

1. Jede Frage hat ein sichtbares Label; Platzhalter ersetzen kein Label.
2. Thematisch zusammengehörige Radio-/Checkbox-Gruppen verwenden `fieldset` und `legend`.
3. Pflicht- und optionale Felder werden textlich konsistent markiert; ein Stern allein reicht nicht.
4. Hilfetext steht vor einem Fehlertext und ist mit `aria-describedby` verknüpft.
5. Fehler stehen direkt am Feld und zusätzlich in einer Fehlerübersicht nach fehlgeschlagenem Speichern.
6. Read-only-Werte werden als Text/Property angezeigt, nicht als disabled Input, wenn keine Eingabe erwartet wird.
7. Disabled wird nur für vorübergehend nicht verfügbare Aktionen verwendet und begründet. Rollenbedingt nicht freigegebene Daten werden nicht gerendert beziehungsweise verborgen und serverseitig gefiltert.
8. Erfolg wird nicht pauschal durch grüne Umrandung jedes befüllten Feldes angezeigt.
9. Hauptaktion ist einmal klar hervorgehoben; Löschen bleibt destruktiv und räumlich getrennt.
10. Lange Formulare erhalten eine persistente, aber nicht überdeckende Aktionszone und Schutz vor ungespeicherten Änderungen.

## 15. Navigation, Suche und Filter

### Navigation

Die Abschnittsnavigation bleibt als Anchor-Navigation mit Scrollspy erhalten. Sie verwendet kompakte Zeilen, klaren aktiven Zustand und keine Card pro Link. Verborgene Abschnitte werden samt Link aus Tastatur- und Accessibility-Tree entfernt. Demo-Steuerung, Theme und Formaktionen sind separate Gruppen.

### Suche und Filter

Im analysierten Personenformular wurden keine Such- oder Filterkomponenten gefunden. Für spätere Listenansichten gelten vorläufig:

- Suche ist ein beschriftetes `search`-Formular;
- Filter sind als klar benannte Controls mit sichtbarem Aktivzustand und Rücksetzen-Funktion organisiert;
- aktive Filter dürfen kompakte Chips nutzen, müssen aber textlich entfernbar sein;
- Ergebniszahl und Lade-/Leerzustand werden in einer Statusregion aktualisiert;
- keine Implementierung, bevor Suchmodell, Filterfelder und serverseitiges Verhalten spezifiziert sind.

## 16. Listen, Tabellen, Beziehungen und Normdaten

### Listen und wiederholbare Einträge

Jeder Eintrag folgt derselben Anatomie:

```html
<article class="ui-entry">
  <header class="ui-entry__header">…</header>
  <div class="ui-entry__properties">…</div>
  <div class="ui-entry__actions">…</div>
</article>
```

Zwischen Einträgen steht eine dünne Trennlinie. Eine Card, ein Schatten und ein farbiger Badge pro Eintrag sind nicht erlaubt. Der Leerzustand, Hinzufügen, Bearbeiten und Entfernen sind für alle Listen konsistent.

### Tabellen

Tabellen werden nur für echte Zeilen-/Spaltenbeziehungen verwendet. Sie besitzen Caption oder zugänglichen Namen, Headerzellen, responsive Überlaufbehandlung und tabellarische Zahlen. Record History bleibt eine Tabelle.

### Beziehungen

Beziehungen werden als wiederholbare Property-Einträge dargestellt: Zielentität, Beziehungstyp, Zeitraum, Quelle/Provenienz und Aktionen. Ein Status Chip ist nur für einen echten Beziehungsstatus zulässig.

### Normdaten

Primäre Register stehen als kompakte Label-Wert-Link-Zeilen. Selten verwendete Register können in einer nativen Disclosure-Gruppe liegen. Externe Links erhalten zugänglichen Namen und `rel="noopener noreferrer"`; die ID bleibt kopierbar. Monospace ist für Identifikatoren zulässig, nicht für die Interpretation.

## 17. Metadaten, Notizen und Rollen

### Metadaten

Metadaten verwenden eine `dl`- oder Property-Grid-Struktur ohne eigenen Rahmen um jeden Wert. Technische Rohdaten bleiben in einem klar abgegrenzten administrativen Abschnitt.

### Notizen und Kommentare

Notizen verwenden eine flache Thread-Struktur mit Autor, Zeit, Text und erlaubten Aktionen. Rollenbadges erscheinen nur, wenn die Rolle für die Bewertung des Inhalts relevant ist. Antworten werden durch Einrückung und dezente Verbindung, nicht durch verschachtelte Cards, kenntlich gemacht.

### Rollen und Berechtigungen

- UI-Berechtigungen werden aus einer zentralen deklarativen Matrix abgeleitet.
- `hidden`, `inert`, tatsächliche Control-Deaktivierung und Event-Guards bleiben synchron.
- Nicht freigegebene Daten werden produktiv serverseitig weder geliefert noch exportiert.
- Read-only ist ein eigener Anzeigezustand, nicht ein überlagerter Editierzustand.
- Eine Demo-Rollenwahl wird als Entwicklungssteuerung klar außerhalb des Fachdokuments dargestellt.
- Der aktuelle Record-Viewer zeigt nur die explizit freigegebenen Felder; dies bleibt Regressionstest.

## 18. Komponentenregeln

### 18.1 Button und Icon Button

- Semantik: `<button>` für Aktionen, `<a>` für Navigation.
- Klassen: `.ui-button`, Varianten `--primary`, `--secondary`, `--danger`, `--quiet`; Größen `--sm`, `--md`.
- Zustände: default, hover, focus-visible, active, disabled, loading.
- Icon-only: `.ui-icon-button`, quadratisch, mindestens 36px; immer zugänglicher Name; dekoratives Icon `aria-hidden="true"`.
- Nicht erlaubt: Pillen für normale Buttons, Hover-Sprung durch `translateY`, Farbe ohne Bedeutungsrolle.

### 18.2 Field

- Struktur: `.ui-field` mit Label, optionalem Hilfetext, Control, Fehler.
- Controls: native Inputs, Selects, Textareas.
- `aria-describedby` verweist auf Hilfe und Fehler; `aria-invalid=true` nur bei Fehler.
- Größen folgen Control-Tokens; keine feldspezifische Komfortklasse ohne begründeten Bedarf.

### 18.3 Radio/Checkbox Group

- `fieldset` und `legend`; Optionen in DOM- und visueller Reihenfolge identisch.
- große Auswahlkacheln nur bei wenigen, gegenseitig ausschließenden und entscheidenden Optionen wie Lebensstatus.
- ausgewählter Zustand erfüllt Text- und Non-Text-Kontrast; sichtbarer Focus Ring bleibt erhalten.

### 18.4 Form Section und Section Container

- `<section aria-labelledby>` mit `.ui-section`.
- genau ein Kopf, optional Beschreibung und Aktionen, anschließend Body.
- Standard: dünner Rahmen oder lediglich Abstand, kein Schatten.
- Unterabschnitte werden durch Überschrift, Abstand und optionalen Separator gegliedert.

### 18.5 Inline Notice

- `.ui-notice` mit `info`, `success`, `warning`, `danger`.
- `role="alert"` nur für dringende, dynamisch eingetretene Fehler; `role="status"` für nicht dringende dynamische Rückmeldung.
- normaler Datenwert ist keine Notice.

### 18.6 Status Chip

- `.ui-chip` nur für Status, Kategorie oder aktivierbaren Filter.
- kurze Texte; semantische Farbe plus Text/Icon; kein Badge für jeden Metadatenwert.

### 18.7 Progressive Disclosure

- bevorzugt `<details><summary>` für einfache, unabhängige Zusatzinformationen;
- Bootstrap Collapse bleibt nur, wenn programmatische Gruppensteuerung oder bestehende Regressionen dies erfordern;
- Zustand muss ohne visuelles Icon verständlich und per Tastatur bedienbar sein.

### 18.8 Dialog

- Bootstrap Modal bleibt zunächst technische Basis.
- einheitlicher Titel, Schließen-Button auf Deutsch, Body und Footer;
- Abbrechen darf keine Datenänderung übernehmen;
- destruktive Aktion getrennt und bestätigt;
- Fokus beim Öffnen sinnvoll setzen, beim Schließen zum Auslöser zurückführen;
- natives `<dialog>` wird erst in einem einzelnen Pilot mit Browser- und Regressionstest bewertet.

### 18.9 Autocomplete/Combobox

- visuell Input plus Popup-Liste;
- semantisch WAI-ARIA-Comboboxpattern mit `aria-expanded`, `aria-controls`, `aria-autocomplete`, Listbox und Options;
- Tastatur: Pfeil hoch/runter, Enter, Escape, Tab ohne Fokusfalle;
- Auswahl darf Freitext nur dann verhindern, wenn fachlich beschlossen.

### 18.10 Empty und Loading State

- Empty State nennt Zustand und – falls erlaubt – nächste Aktion.
- „nicht vorhanden“, „unbekannt“, „nicht anwendbar“ und „nicht freigegeben“ sind unterschiedliche Texte/Zustände.
- Loading State wird nur für echte asynchrone Vorgänge ergänzt; kein dekorativer Skeleton für synchrone statische Daten.

### 18.11 Tooltip

- nur für ergänzende, nicht notwendige Information;
- notwendige Bedieninformation steht sichtbar oder im zugänglichen Namen;
- per Hover und Tastatur verfügbar, Escape schließt JS-basierte Tooltips;
- `title` allein ist kein vollwertiger Ersatz.

### 18.12 Speicher- und Aktionsbereich

- primär: Speichern/Übernehmen;
- sekundär: Abbrechen/Zurück;
- destruktiv: Löschen, räumlich getrennt;
- Reset und technischer Export sind nachrangig;
- rollenbedingt unerlaubte Aktionen werden nicht angeboten und zusätzlich in der Logik blockiert.

Tabs, Side Panels, Popovers und Aktionsmenüs werden derzeit nicht als Zielkomponenten festgelegt, weil kein belegter Bedarf besteht.

## 19. Zustände, Fokus und Accessibility

Verbindliche Zustände jeder interaktiven Komponente:

- default, hover, focus-visible, active/pressed, selected;
- empty und populated;
- valid und invalid;
- readonly und disabled;
- hidden beziehungsweise nicht berechtigt;
- loading nur bei asynchroner Aktivität;
- lange/umbrechende Inhalte;
- heller und dunkler Modus;
- `prefers-reduced-motion`.

Fokus wird mit einem mindestens 2px starken, deutlich kontrastierenden Ring außerhalb des Controls dargestellt und nie ohne Ersatz entfernt. Bedeutung wird nicht ausschließlich durch Farbe vermittelt. Zielstandard ist WCAG 2.2 AA: normaler Text mindestens 4,5:1, großer Text mindestens 3:1, relevante Controlgrenzen und Fokusindikatoren mindestens 3:1.

Die DOM-Reihenfolge entspricht der visuellen Reihenfolge. Nach einem fehlgeschlagenen Speichern erhält die Fehlerübersicht Fokus; ihre Links führen zu den Feldern. Nach Hinzufügen eines wiederholbaren Eintrags wechselt der Fokus zur Eintragsüberschrift oder zum ersten Control. Nach Löschen wechselt er zur nächsten sinnvollen Aktion.

## 20. JavaScript-Grundsätze

1. Native HTML-Funktion vor eigener Logik.
2. Kleine Module mit einer Verantwortung und expliziter Initialisierung.
3. Keine neuen Inline-Handler; Event Listener über stabile `data-*`-Hooks.
4. CSS-Klassen steuern Darstellung, `hidden`, `inert`, `disabled`, `readonly` und ARIA steuern Semantik/Zugriff.
5. Rollen- und Statuslogik aus einer gemeinsamen Zustandsquelle; keine konkurrierenden nachgelagerten Korrekturschichten.
6. Benutzerinhalte nur über `textContent` oder korrektes Escaping in HTML einsetzen.
7. Benutzeraktionen mit Datenverlust transaktional behandeln.
8. Custom Events dokumentieren: derzeit `person-role-changed`, `edtf-entry-added`, `edtf-wirkungsort-added`, `edtf-components-ready`.
9. Öffentliche Globals reduzieren; derzeit `window.addRolleToEntry`, `window.collectPersonFormData`, `window.EDTFForm`.
10. Ausfall externer Module sichtbar und handlungsorientiert behandeln; CDN-Abhängigkeiten optional lokal vendorn.

## 21. Bootstrap-Strategie

### Entscheidung

Bootstrap 5.3.2 wird während der ersten drei Migrationsphasen als Übergangsbasis beibehalten. Eine vollständige sofortige Entfernung wird verworfen.

Begründung:

- das Markup nutzt Bootstrap Grid und Utilities sehr umfangreich;
- 38 Cards, 70 statische Buttonklassen, 60 Badges und zahlreiche Formklassen sind gekoppelt;
- Modale, Collapse und Scrollspy benötigen Bootstrap JavaScript;
- eigene Stile überschreiben Bootstrap bereits tiefgreifend, weshalb zuerst Produkttokens und Komponentenverträge stabilisiert werden müssen;
- ein Big-Bang-Austausch würde Fachlogik und Accessibility unnötig gefährden.

### Komponentenweise Entscheidung

| Bootstrap-Bereich              | Entscheidung                       | Ziel                                                      |
| ------------------------------ | ---------------------------------- | --------------------------------------------------------- |
| Reboot/Basis                   | beibehalten, später prüfen         | stabile Cross-Browser-Basis                               |
| Grid                           | beibehalten                        | schrittweise nur in Komponenten durch CSS Grid ersetzen   |
| Spacing/Flex/Display Utilities | beibehalten, Nutzung reduzieren    | Layout-Primitives für wiederkehrende Muster               |
| Form Controls                  | beibehalten und neu gestalten      | native Semantik plus Produkttokens                        |
| Buttons                        | neu gestalten                      | eigene Varianten, Bootstrapklasse vorübergehend parallel  |
| Cards                          | schrittweise ersetzen              | `.ui-section` und `.ui-entry`                             |
| Alerts                         | neu gestalten/semantisch begrenzen | `.ui-notice`                                              |
| Badges                         | stark reduzieren und neu gestalten | `.ui-chip`                                                |
| Table/Responsive Wrapper       | beibehalten                        | Token-Styling                                             |
| Modal                          | beibehalten                        | einheitliche Dialoganatomie; natives Pilotprojekt später  |
| Collapse/Accordion             | durch natives HTML ersetzen        | `<details>/<summary>` für einfachen Normdatenfall         |
| Scrollspy                      | beibehalten                        | Abschnittsnavigation                                      |
| Tooltip/Popover JS             | nicht verwendet                    | nicht einführen                                           |
| Bootstrap Icons                | vorerst beibehalten                | zugängliche Icon-Komponente; lokale Bereitstellung prüfen |

Bootstrap darf erst vollständig entfernt werden, wenn keine Bootstrap-JS-Komponente mehr benötigt wird, die Utility-/Grid-Nutzung deutlich gesunken ist und eine Komponentenreferenzseite alle ersetzten Zustände regressionsgeprüft abbildet.

## 22. Namenskonventionen

- neutrale UI-Komponente: `.ui-component`, Element `.ui-component__part`, Variante `.ui-component--variant`;
- Zustand primär über native Attribute: `[hidden]`, `[disabled]`, `[readonly]`, `[aria-invalid="true"]`, `[aria-expanded="true"]`; nur bei Bedarf `.is-loading`;
- Layout-Primitives: `.l-stack`, `.l-cluster`, `.l-grid`, `.l-sidebar`, `.l-split`;
- kleine Utilities: `.u-visually-hidden`, `.u-break-anywhere`; keine Nachbildung sämtlicher Bootstrap-Utilities;
- fachliche Komponenten: `.person-life-data`, `.authority-record`, `.source-entry`, `.audit-history`; keine rein visuelle Benennung;
- JS-Hooks: `data-js="autocomplete"`, `data-action="add-entry"`; Styling nicht an JS-Hook koppeln;
- IDs: stabile, deutschsprachige fachliche IDs können aus Kompatibilitätsgründen bleiben; neue IDs in `kebab-case`;
- JavaScript: `camelCase` für Funktionen/Variablen, `PascalCase` für Klassen, beschreibende Eventnamen im Format `domain:event` bei späterer kontrollierter Migration;
- Tokens: `--color-*`, `--space-*`, `--font-*`, `--control-*`, `--z-*`.

Bootstrap- und neue Klassen dürfen während einer Migration parallel stehen. Neue Komponenten dürfen jedoch nicht ausschließlich durch globale Bootstrap-Overrides definiert werden.

## 23. Anti-Patterns

Nicht erlaubt:

- Cards innerhalb von Cards zur bloßen fachlichen Gruppierung;
- Alertsemantik für normale Datenwerte;
- weiße Schrift auf unzureichend kontrastierenden Pastellflächen;
- Pillenform für gewöhnliche Buttons und Metadaten;
- Schatten oder Hover-Bewegung ohne funktionale Bedeutung;
- zusätzliche Akzentfarben pro Abschnitt;
- dekorative Icons ohne Nutzen;
- Icon-only-Aktionen ohne zugänglichen Namen;
- neue section-spezifische Abstands- oder Farbwerte, wenn ein Token passt;
- visuelle Rollensteuerung als Ersatz für tatsächliche Berechtigungen;
- CSS-Reordering, das die DOM-Reihenfolge verändert;
- Platzhalter als einziges Label;
- deaktivierte Felder als Standarddarstellung von Read-only-Daten;
- neue Framework-, Tailwind- oder Build-Abhängigkeiten;
- technische Einbindung von shadcn/ui;
- Entfernung von Fachlogik zur Vereinfachung des Layouts.

## 24. Mapping auf das Zielsystem

| Bestehende Komponente                       | Fachliches Zielmuster              | Technische Umsetzung                                                    |
| ------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `.form-section > .card`                     | Section Container                  | `<section aria-labelledby>` plus `.ui-section`                          |
| innere `.card`-Einträge                     | Repeatable Entry                   | `<article class="ui-entry">`, Grid und Separator                        |
| `.row-separator`, `.form-subsection`        | Field Group/Subsection             | `<section>` oder `fieldset`, `.ui-subsection`                           |
| `.compact-value-grid`, Source-DL, Plaintext | Property/Data Row                  | `.ui-property-list` und `.ui-data-row`                                  |
| Bootstrap Alert                             | Inline Notice                      | `.ui-notice`; ARIA nur nach Rückmeldungsart                             |
| Bootstrap Badge                             | Status Chip                        | `.ui-chip` mit begrenzten semantischen Varianten                        |
| Bootstrap Button                            | Button/Icon Button                 | natives Element plus `.ui-button`/`.ui-icon-button`                     |
| Bootstrap Accordion                         | Progressive Disclosure             | `<details>/<summary>` für Normdaten                                     |
| Bootstrap Modal                             | Dialog                             | zunächst standardisiertes Bootstrap Modal, später Pilot mit `<dialog>`  |
| Bootstrap Grid                              | Grid/Stack                         | zunächst übernehmen; in neutralen Komponenten CSS Grid/Flex             |
| `.dynamic-field-row`                        | Repeatable Field Row               | gemeinsames List-/Entry-Modul                                           |
| `.autocomplete-*`                           | Combobox                           | eigenes Vanilla-JS-Modul mit vollständigem ARIA-Pattern                 |
| `.disabled-section`                         | Permission/Availability State      | Rendering plus `hidden`/`inert`/disabled und zentrale Permission Matrix |
| `.has-value`                                | populated state                    | kein eigener Erfolgsstil; optional `[data-populated]` nur für Logik     |
| `.source-detail-list`                       | Property List                      | semantisches `dl`, flache Zeilen ohne Einzelkarten                      |
| `.wirkungsort-*`                            | fachlicher Activity/Place Entry    | gemeinsames Entry-Grundmuster, fachliche Felder bleiben                 |
| `.json-pre`                                 | Code/Data Viewer                   | `<pre><code>` mit Tokenfarben und Copy-Aktion                           |
| `.created-timestamp`                        | Timestamp with supplemental detail | `<time datetime>`; sichtbares Format, Tooltip nur ergänzend             |

## 25. Vollständige Migrationsmatrix

Aufwand: XS, S, M, L, XL. Aktion verwendet ausschließlich die vorgegebenen Kategorien.

| Bestand                       | Fundstelle                                    | Zielmuster                    | Technische Umsetzung                              | Aktion           | Begründung                                  | Priorität | Aufwand | Abhängigkeiten               | Phase |
| ----------------------------- | --------------------------------------------- | ----------------------------- | ------------------------------------------------- | ---------------- | ------------------------------------------- | --------- | ------- | ---------------------------- | ----: |
| Bootstrap 5.3.2 CSS           | `index.html:8`                                | Übergangsbasis                | CDN zunächst beibehalten, später lokal/entfernbar | übernehmen       | starke aktuelle Kopplung                    | kritisch  | XS      | Regressionstests             |     1 |
| Bootstrap Bundle              | `index.html:2247`                             | Interaktionsbasis             | Modal, Collapse, Scrollspy selektiv               | übernehmen       | sofortiger Ersatz riskant                   | kritisch  | XS      | JS-Inventur                  |     1 |
| Bootstrap Icons               | `index.html:9`, `bi-*`                        | Icon-System                   | zunächst behalten, Namen/ARIA standardisieren     | modernisieren    | 72 statische Icons plus dynamische          | hoch      | M       | Icon-Audit                   |     3 |
| Marker.io                     | `index.html:15–28`                            | Demo-Feedback                 | außerhalb Produktlaufzeit konditional             | übernehmen       | nicht fachkritisch                          | niedrig   | XS      | Deploymentkontext            |     4 |
| EDTF CDN-Modul                | `edtf-component.js:1–2`                       | Datumsparser                  | Version fixieren, lokale Bereitstellung prüfen    | modernisieren    | Kernfunktion hängt am Netzwerk              | hoch      | M       | Lizenz/Dateigröße            |     2 |
| Seitencontainer 800px         | `index.html:37`                               | Workbench Container           | CSS-Token bis 70rem                               | ersetzen         | verhindert breite Fachlayouts               | hoch      | S       | responsive Tests             |     2 |
| Inline-Styles                 | `index.html:37,177–178`                       | Komponenten-/State-CSS        | in geordnete CSS-Schicht überführen               | entfernen        | erschwert Tokens und Kaskade                | hoch      | S       | Tokens                       |     2 |
| Sticky Sidebar                | `styles.css:147–177`                          | In-page Navigation            | Desktop sticky, schmal kompakt                    | modernisieren    | grundsätzlich wertvoll, mobil offen         | hoch      | M       | Layoutbreite                 |     3 |
| Scrollspy                     | `index.html:43`, `form.js:934–940`            | aktiver Navzustand            | Bootstrap vorerst                                 | übernehmen       | funktional geeignet                         | mittel    | S       | Sidebar                      |     3 |
| Demo-Tags                     | `index.html:47–50`                            | Demo Statusline               | neutraler Text/kleine Statusgruppe                | vereinfachen     | vier Pills erzeugen Rauschen                | niedrig   | XS      | Chip-Komponente              |     3 |
| Rollen-Gate im Formular       | `index.html:65–138`                           | Demo Toolbar                  | außerhalb Fachformular platzieren                 | ersetzen         | Rolle ist keine Personeneigenschaft         | hoch      | M       | Permission Matrix            |     3 |
| Rollen-Radio ohne Fieldset    | `index.html:80–125`                           | Radio Group                   | `fieldset`/`legend`                               | modernisieren    | native Gruppensemantik fehlt                | hoch      | S       | HTML-Regression              |     2 |
| Lebensstatus-Kacheln          | `index.html:141–181`, CSS Z. 299–358          | Choice Card Group             | Fieldset, kontraststarke Zustände                 | modernisieren    | Fach-Gate bleibt, Kontrast/Fokus verbessern | kritisch  | M       | Farb-/Fokustokens            |     2 |
| Anzeigename-Alert             | `index.html:184–212`                          | Computed Data Row             | Output/Property ohne Alertrolle                   | ersetzen         | normaler Wert ist kein Alarm                | hoch      | S       | Data Row                     |     3 |
| `alert-sec ondary`            | `index.html:194`                              | korrekte Klasse bis Migration | Tippfehler korrigieren                            | modernisieren    | nachgewiesener Defekt                       | hoch      | XS      | keine                        |     1 |
| Hauptabschnitt-Card           | 13 `.form-section`                            | Section Container             | `.ui-section` parallel zu Bootstrap               | vereinheitlichen | gemeinsame Haupthierarchie                  | kritisch  | L       | Tokens, Pilot                |     3 |
| `.row-separator`              | `styles.css:360–370`                          | Subsection Separator          | `.ui-subsection + …`                              | vereinheitlichen | Name/Verwendung widersprüchlich             | mittel    | S       | Section Pattern              |     3 |
| Lebensdaten-Subsection        | `index.html:611–648`, CSS Z. 372–486          | Referenz-Unterabschnitt       | neutralen Bestand weiterverwenden                 | übernehmen       | bereits flach und wiederverwendbar          | hoch      | S       | Layoutentscheidung           |     2 |
| unerreichbare Container Query | `styles.css:471–486`                          | responsive Split              | Breite/Schwelle gemeinsam entscheiden             | modernisieren    | Regel kann aktuell nie greifen              | kritisch  | S       | Containerbreite              |     2 |
| `.form-control-comfortable`   | `styles.css:443–445`                          | Control Size Variant          | Token `--control-height-lg` nur begründet         | vereinheitlichen | fachbereichsspezifische Größe vermeiden     | niedrig   | XS      | Control Tokens               |     2 |
| EDTF Summary                  | `EdtfDateInput.render`                        | Compact Data Row              | `.ui-data-row`-Anatomie                           | vereinheitlichen | gutes Grundmuster                           | hoch      | M       | Data Row                     |     3 |
| EDTF Edit Action              | `.edtf-edit-action`                           | Icon Button                   | `.ui-icon-button`                                 | vereinheitlichen | gemeinsame Größe/ARIA                       | hoch      | S       | Button                       |     3 |
| EDTF Date Modal               | `EdtfDateInput`, `configureTransactionalDate` | Transactional Dialog          | Bootstrap Modal standardisieren                   | übernehmen       | starke Fachlogik vorhanden                  | kritisch  | M       | Dialog Pattern               |     3 |
| EDTF Date List                | `EdtfDateList`                                | Repeatable List               | gemeinsames Listencontract                        | übernehmen       | bester vorhandener Listenpilot              | hoch      | M       | Entry Pattern                |     3 |
| EDTF Interval Box             | `EdtfIntervalInput.render:552`                | Field Group                   | Rahmenhierarchie reduzieren                       | vereinfachen     | zusätzliche Box in Eintrag                  | mittel    | M       | EDTF Tests                   |     3 |
| Dynamic Field Row             | `styles.css:261–265`, `form.js:343 ff.`       | Repeatable Field              | neutrales Modul                                   | vereinheitlichen | mehrfach benötigt                           | hoch      | M       | JS-Modularisierung           |     3 |
| Tätigkeits-Cards              | `index.html:665–779`, `form.js:383–424`       | Activity Entry List           | flache Articles/Separator                         | ersetzen         | Card-in-Card und zwei Anatomien             | hoch      | L       | fachliches Modell            |     3 |
| Wirkungsort-Cards             | `index.html:865–1138`, `form.js:455–536`      | Place/Activity Entry          | gemeinsames Entry Pattern                         | ersetzen         | überkartet, überschneidet Tätigkeit         | hoch      | L       | Tätigkeits-/Ortsentscheidung |     3 |
| Wirkungsort-Badges            | `index.html:877 ff.`, `.wirkungsort-meta`     | Properties/Status             | normale Properties; Chip nur Status               | vereinfachen     | Metadaten sind keine Statuschips            | mittel    | M       | Entry Pattern                |     3 |
| Quellen-Cards                 | `index.html:1218–1350`                        | Source Entry List             | flache Einträge                                   | ersetzen         | drei Rahmungsebenen                         | hoch      | L       | Entry/Property Pattern       |     3 |
| `.source-detail-list dd`      | `styles.css:631–659`                          | Property List                 | flaches `dl` Grid                                 | ersetzen         | Einzelwert-Container unnötig                | mittel    | S       | Property Tokens              |     3 |
| Kommentare-Cards              | `index.html:1385–1528`                        | Note Thread                   | flache Threadstruktur                             | ersetzen         | verschachtelte visuelle Ebenen              | hoch      | L       | Rollenaktionen               |     3 |
| Record-History-Tabelle        | `index.html:1555–1655`                        | Audit Table                   | semantische Tabelle, Tokenstyling                 | übernehmen       | geeignete Datenstruktur                     | mittel    | M       | Statusvokabular              |     3 |
| History-Badges                | `index.html:1566 ff.`                         | Audit Status                  | begrenzte Chipvarianten                           | vereinheitlichen | Status ist berechtigt, Farben uneinheitlich | mittel    | S       | Chip Tokens                  |     3 |
| Importdaten                   | `index.html:1662–1801`                        | Admin Data Viewer             | eigener administrativer Abschnitt                 | modernisieren    | fachlich speziell, visuell abgrenzen        | mittel    | M       | Rollenmatrix                 |     3 |
| `.json-pre`                   | `styles.css:581–601`                          | Code Viewer                   | Tokens, Copy, Wrap/Scroll                         | modernisieren    | technisch sinnvoll, Farben direkt kodiert   | niedrig   | S       | Farbkontrast                 |     3 |
| Bootstrap Modal statisch      | `index.html:1850–2241`                        | Dialog                        | gemeinsame Struktur/Labels                        | vereinheitlichen | sechs Varianten und Sprachmix               | hoch      | M       | Dialog Pattern               |     3 |
| Normdaten Accordion           | `index.html:434–449`                          | Disclosure                    | `<details>/<summary>`                             | ersetzen         | einfacher nativer Fall                      | mittel    | M       | No-JS-/A11y-Test             |     3 |
| Buttons global                | `styles.css:488–579`                          | Button System                 | Produkttokens und Varianten                       | ersetzen         | Kontrast, Gradient, Bewegung, `!important`  | kritisch  | L       | Tokens, Referenzseite        |   2–3 |
| Icon-only Buttons             | statisch und dynamisch                        | Icon Button                   | fester Name, Größe, Fokus                         | vereinheitlichen | Accessibility inkonsistent                  | kritisch  | M       | Icon Audit                   |     2 |
| Alerts global                 | `styles.css:53–96`                            | Notice System                 | vier semantische Varianten                        | vereinheitlichen | acht Varianten/Mehrfachnutzung              | hoch      | M       | Farb Tokens                  |   2–3 |
| Badges global                 | 60 Vorkommen                                  | Chip System                   | Bestand reduzieren                                | vereinfachen     | visuelle Überlastung                        | hoch      | L       | semantisches Audit           |     3 |
| `.has-value`                  | `styles.css:120–129`, `form.js:817–831`       | neutral populated             | Stil entfernen                                    | entfernen        | befüllt ist nicht validiert                 | hoch      | S       | Validation                   |     2 |
| Validation                    | `validation.js`                               | Field Error + Summary         | bestehend plus Error Summary/Fokus                | modernisieren    | feldnah vorhanden, Übersicht fehlt          | kritisch  | M       | Formaktionsfluss             |   2–3 |
| Autocomplete                  | `form.js:713–803`                             | ARIA Combobox                 | eigenes Modul mit Listboxsemantik                 | modernisieren    | Tastatur teilweise, ARIA fehlt              | kritisch  | L       | A11y Tests                   |     3 |
| Disabled Overlay              | `styles.css:182–239`                          | Permission/Read-only State    | echte Semantik/Rendering                          | ersetzen         | Overlay allein reicht nicht                 | kritisch  | L       | Permission Matrix            |   2–3 |
| Viewer Permissions            | `form.js:26–214`                              | deklarative Feldfreigabe      | zentrale Policy plus Serverpflicht                | modernisieren    | Funktion vorhanden, clientseitig begrenzt   | kritisch  | L       | Sicherheitsarchitektur       |   1–3 |
| Form Validation Viewer Guard  | `validation.js:87–93`                         | Permission-aware Validation   | zentrale Policy abfragen                          | übernehmen       | verhindert falsche Pflichtprüfung           | kritisch  | S       | Permissions                  |     1 |
| Theme                         | `theme.js`, Dark Overrides                    | Theme System                  | semantische Tokens, `aria-pressed`                | modernisieren    | Funktion vorhanden, Werte dupliziert        | mittel    | M       | Tokens                       |     2 |
| CSS-Tooltip                   | `styles.css:661–700`                          | Timestamp/Tooltip             | `<time>` plus optional Tooltip                    | modernisieren    | Fokusierbarkeit uneinheitlich               | niedrig   | M       | Tooltipentscheidung          |     3 |
| `!important`                  | 51 Vorkommen                                  | geordnete Kaskade             | schrittweise reduzieren                           | entfernen        | erschwert Komponentenpflege                 | hoch      | L       | Komponenten-Migration        |   2–4 |
| globale Bootstrap Overrides   | `styles.css`                                  | Produktkomponenten            | Tokens + scoped Klassen                           | ersetzen         | Kopplung und Seiteneffekte                  | hoch      | XL      | alle Piloten                 |   2–4 |
| Focus-visible System          | punktuell                                     | Global Focus Ring             | Basestyle + Komponenten                           | neu ergänzen     | konsistenter Fokus fehlt                    | kritisch  | M       | Fokus Token                  |     2 |
| Error Summary                 | nicht gefunden                                | Form Error Summary            | Statusblock mit Feldlinks                         | neu ergänzen     | langes Formular                             | hoch      | M       | Validation                   |     3 |
| Dirty State                   | nicht gefunden                                | Unsaved Changes Guard         | kleines JS-Modul                                  | neu ergänzen     | Schutz vor Datenverlust fehlt               | mittel    | M       | Save-Verhalten               |     3 |
| Component Reference           | nicht gefunden                                | Referenzseite                 | statische HTML-Seite                              | neu ergänzen     | Zustände/Varianten prüfbar machen           | hoch      | L       | Komponentenphase             |     4 |
| Such-/Filterkomponenten       | nicht gefunden                                | spätere Listenwerkzeuge       | erst nach Fachspezifikation                       | neu ergänzen     | im Formular kein belegter Bestand           | niedrig   | XL      | Suchanforderungen            | offen |

## 26. Phasenweiser Migrationsplan

### Phase 1 – Bestand stabilisieren

Voraussetzungen: eingefrorener Referenzcommit und Testdatensatz.  
Arbeiten: Tippfehler und Kontrast-/ARIA-Defekte als separate kleine Fixes; Rollen-, Lebensstatus-, EDTF-, Export- und Resetregressionen dokumentieren; Komponentenreferenzfälle definieren; CDN- und Browseranforderungen festhalten.  
Ergebnis: reproduzierbare Baseline ohne visuelle Neustrukturierung.  
Abnahme: aktueller Funktionsumfang läuft in Zielbrowsern; Viewerfälle, EDTF und dynamische Listen sind testbar.

### Phase 2 – Grundlagen vereinheitlichen

Voraussetzungen: Phase-1-Baseline.  
Arbeiten: Produkttokens einführen und auf Bootstrap mappen; Typografie/Fokus/Controlgrößen; 800px-Entscheidung; `.has-value` entfernen; Button-/Notice-Grundregeln; Namens- und CSS-Schichten.  
Ergebnis: visuelle Basis ohne Austausch komplexer Komponenten.  
Abnahme: Hell/Dunkel, Kontrast, Fokus, 320–1440px, keine unbeabsichtigten Komponentenänderungen.

### Phase 3 – Komponenten modernisieren

Reihenfolge:

1. Lebensdaten als Referenzpilot abschließen;
2. Identität als Formular-/Fieldset-Pilot;
3. Anzeigename und Normdaten als Property-/Disclosure-Pilot;
4. Tätigkeiten und Wirkungsorte nach fachlicher Modellentscheidung;
5. Quellen und Kommentare als Repeatable-/Thread-Pilot;
6. Navigation, Dialoge, Autocomplete, Record History und Import;
7. Rollen-/Berechtigungsdarstellung zentralisieren.

Ergebnis: eigene neutrale Komponenten neben weiterhin nötigen Bootstrap-Funktionen.  
Abnahme: jede migrierte Komponente auf Referenzseite; Tastatur-, Screenreader-, Rollen-, Status-, Responsive- und Datenregression bestanden.

### Phase 4 – Qualität, Entkopplung und Dokumentation

Arbeiten: ungenutztes CSS nach dynamischer Codeanalyse entfernen; `!important` reduzieren; Bootstrap-Nutzung neu vermessen; lokale Assets/CDNs prüfen; Browsermatrix; Komponentenreferenz und Changelog; Entscheidung über verbleibendes Bootstrap.  
Ergebnis: wartbare statische Anwendung und nachweisbarer Migrationsstand.  
Abnahme: keine nicht dokumentierten Varianten; keine kritischen Accessibility-Verstöße; vollständige Regression; aktualisierte Matrix.

## 27. Regressionstests und Abnahmekriterien

Mindestens zu testen:

- Rollen: DB-Owner, Record-Owner, Record-Editor, Record-Viewer;
- Viewer + verstorben: nur Anzeigename und vorhandene Kommentare;
- Viewer + lebend: zusätzlich Vorname, Nachname und Quellen; weiterhin strikt read-only;
- Rollen- und Lebensstatuswechsel ohne zurückbleibende sichtbare oder fokussierbare Controls;
- EDTF: leer, Jahr, Monat, Tag, unbekannte Stellen, Qualifier, Intervall, offen, ungültig, Chronologie;
- Geburt/Tod vorhanden oder fehlend; lebend mit vorhandenem Sterbedatum;
- weitere Lebensdaten: 0/1/n, Add/Edit/Cancel/Delete;
- Tätigkeit/Wirkungsort: Add/Delete, Autocomplete, Zeitraum;
- Quelle/Kommentar/Notiz: öffnen, validieren, abbrechen, speichern, Rollenblockade;
- JSON-Export und Reset für erlaubte Rollen; blockiert für Viewer;
- Tastatur: Tabreihenfolge, Radio, Combobox, Disclosure, Dialog, Escape, Fokus-Rückkehr;
- Screenreader: Labels, Legends, Hilfe/Fehler, Statusregionen, Tabellenköpfe;
- hell/dunkel, Forced Colors und `prefers-reduced-motion`;
- 320, 375, 576, 768, 1024, 1280 und 1440px; kein horizontaler Seitenüberlauf;
- lange Namen, IDs, Interpretationen, Orts- und Institutionstexte;
- Verhalten bei Ausfall von Bootstrap-CDN, Icon-CDN und EDTF-Modul;
- Chrome/Chromium, Firefox und Safari in den freigegebenen Versionen.

Eine Migrationsphase ist nur abgeschlossen, wenn fachliche Funktionen unverändert funktionieren, alle sichtbaren Controls zugänglich benannt sind, Fokus und Fehlerbehandlung nachvollziehbar bleiben und nicht freigegebene Daten weder in UI noch Export erscheinen. Produktiv ist zusätzlich serverseitige Autorisierung zwingend.

## 28. Risiken und technische Abhängigkeiten

| Risiko                                        | Auswirkung                                       | Gegenmaßnahme                                    |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| globale Bootstrap-Overrides                   | unvorhersehbare Seiteneffekte                    | scoped Komponenten parallel einführen            |
| dynamisch erzeugtes Markup                    | scheinbar ungenutztes CSS wird voreilig gelöscht | HTML und alle JS-Templates gemeinsam analysieren |
| mehrere Rollen-/Statuslistener                | Reihenfolgefehler bei Wechseln                   | zentrale Zustands-/Permission Matrix             |
| externe EDTF-/CDN-Abhängigkeiten              | Kernfunktion offline nicht verfügbar             | lokale Bereitstellung und Failure Tests          |
| Tätigkeiten/Wirkungsorte fachlich überlappend | falsches UI-Modell wird verfestigt               | Fachentscheidung vor visueller Migration         |
| clientseitige Berechtigungen                  | Daten über DOM/JS lesbar                         | serverseitig filtern, speichern und exportieren  |
| Big-Bang-Bootstrap-Entfernung                 | hohe Regression und Aufwand                      | komponentenweise Entkopplung                     |
| visuelles Redesign ohne Referenztests         | Fachlogik geht verloren                          | Pilot, Referenzseite, Rollen-/Datenfixtures      |
| Dark Mode Direktwerte                         | Kontrastdrift                                    | semantische Tokens und automatisierte Checks     |

## 29. Offene Entscheidungen

1. Soll die produktive Anwendung eine breite Desktop-Workbench bis ca. 70rem erhalten oder bewusst einspaltig bleiben?
2. Werden Tätigkeiten und Wirkungsorte fachlich zu einem gemeinsamen Ereignis-/Aktivitätsmodell zusammengeführt?
3. Welche Such- und Filterfunktionen gehören zu den späteren Listenansichten, nicht zum Datensatzformular?
4. Welche Datenquelle und welches ARIA-Verhalten gelten für Freitext versus verbindliche Normauswahl im Autocomplete?
5. Welche Browser- und Offlineanforderungen gelten institutionell; sollen Bootstrap, Icons und EDTF lokal ausgeliefert werden?
6. Welche Speichersemantik besitzt die spätere Anwendung: explizites Speichern, Autosave oder Abschnittsspeicherung?
7. Welche UI-Aktionen müssen produktiv serverseitig autorisiert und protokolliert werden?
8. Wird Dark Mode produktiv benötigt oder bleibt er Demo-/Entwicklungsfunktion?
9. Kann das einfache Normdaten-Accordion ohne fachlichen Verlust durch `<details>` ersetzt werden?
10. Welche bestehenden Beispieldaten bilden verbindliche visuelle Extremfälle?

Offene Entscheidungen blockieren nur die jeweils abhängigen Matrixeinträge, nicht die Einführung von Tokens, Fokus, Typografie und neutralen Grundkomponenten.

## 30. Pflege und Weiterentwicklung

- Dieses Dokument und die Komponentenreferenz sind gemeinsam die Source of Truth.
- Jede neue Komponente benötigt Zweck, Anatomie, Varianten, Zustände, Accessibility, Testfälle und Matrixeintrag.
- Änderungen an Tokens oder Komponenten werden in einem kurzen Changelog mit Motivation und betroffenen Bereichen dokumentiert.
- Fachliche Änderungen und visuelle Änderungen werden getrennt beauftragt und getestet.
- Nach jeder Migrationsphase werden Inventur, Bootstrap-Nutzung, `!important`-Zahl, Accessibility-Befunde und offene Entscheidungen aktualisiert.
- Neue Sonderklassen sind nur zulässig, wenn eine neutrale Komponente den nachgewiesenen Bedarf nicht abdecken kann.
- Entfernen von CSS erfolgt erst nach Prüfung von statischem und dynamisch erzeugtem Markup.

## 31. Wichtigste Designentscheidungen

1. Die Anwendung bleibt statisches HTML/CSS/Vanilla JavaScript ohne Buildzwang.
2. Bootstrap bleibt vorerst gezielte Übergangsbasis; die Migration erfolgt komponentenweise.
3. Eine äußere Struktur pro Hauptabschnitt, flache Einträge statt verschachtelter Cards.
4. Lebensdaten liefern das erste neutrale Pilotmuster, benötigen aber eine bewusste Breitenentscheidung.
5. Visuelle Hierarchie entsteht durch Semantik, Typografie, Abstand und Nähe; Farbe und Container sind nachrangig.
6. Properties, Normdaten und Metadaten verwenden ruhige Label-Wert-Strukturen.
7. Buttons, Notices, Chips, Empty States, Repeatable Entries und Aktionen werden formularweit vereinheitlicht.
8. Rollen-/Statuszustände werden semantisch und technisch erzwungen; CSS-Overlay ist keine Berechtigung.
9. Accessibility, Tastatur, Fokus und Kontrast sind Komponentenanforderungen, keine Abschlusskosmetik.
10. Kein neues Framework und keine technische shadcn/ui-/Tailwind-Abhängigkeit.

## 32. Externe Kontrollreferenzen

- Linear: <https://linear.app/>
- Vercel Geist: <https://vercel.com/geist>
- Notion Product: <https://www.notion.com/product>
- shadcn/ui Components: <https://ui.shadcn.com/docs/components>
- GOV.UK Design System: <https://design-system.service.gov.uk/>
- GOV.UK Error Message: <https://design-system.service.gov.uk/components/error-message/>
- USWDS Form Guidance: <https://designsystem.digital.gov/components/form/>

Diese Quellen dienen als Kontroll- und Inspirationsreferenz. Das vorliegende System übernimmt weder Markenstil noch technische Implementierung dieser Produkte.
