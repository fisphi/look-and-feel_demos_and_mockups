# Migrationsplan für das Personenformular

Planungsstand: 31. Juli 2026  
Referenzstand der Anwendung: Commit `eb4544a`  
Geltungsbereich: `docs/person-form-lookfeel`

## 1. Zweck

Dieser Plan überführt den in `ui-inventory.md` dokumentierten Ist-Zustand schrittweise in den durch `design-system.md` definierten Zielzustand. Er legt Reihenfolge, Abhängigkeiten, Arbeitspakete, Abnahmen, Risiken und Entscheidungstore fest.

Die Anwendung bleibt während der Migration eine statische HTML-Anwendung mit CSS und Vanilla JavaScript. Fachlogik, Rollensteuerung, EDTF-Verhalten und Beispieldaten werden nicht durch rein visuelle Änderungen verändert.

## 2. Verbindliche Grundlagen

Vor jeder Umsetzung sind vollständig zu lesen:

- `ui-inventory.md` als belegter Ist-Zustand;
- `design-system.md` als verbindlicher Zielzustand;
- dieses Dokument als Reihenfolge und Abnahmeregel;
- die jeweils betroffenen HTML-, CSS- und JavaScript-Dateien.

Bei Widersprüchen gilt folgende Rangfolge:

1. fachliche Rechte- und Datenregeln;
2. `design-system.md`;
3. `migration-plan.md`;
4. bestehende Darstellung im Code.

Der Ist-Zustand ist keine Gestaltungsvorgabe. Bestehende Inkonsistenzen dürfen nicht als neue Varianten fortgeschrieben werden.

## 3. Verbindliche Architekturentscheidungen

### 3.1 Formularbreite und Spalten

Das Desktoplayout wird je Abschnitt flexibel ein- oder zweispaltig aufgebaut.

- Eine Spalte gilt für komplexe, textreiche und wiederholbare Datensätze.
- Zwei Spalten sind für kurze, fachlich eng zusammengehörige Bereiche zulässig, insbesondere Geburt und Tod.
- Auf schmalen Ansichten werden alle Bereiche einspaltig dargestellt.
- Die Umschaltung richtet sich nach der verfügbaren Containerbreite, nicht nur nach der Viewportbreite.
- Die starre Inline-Begrenzung auf 800px wird durch eine responsive Workbench-Breite bis ungefähr 70rem ersetzt.
- Die exakte Maximalbreite und Container-Query-Schwelle werden im Layout-Pilot anhand realer Extremwerte festgelegt; die fachliche Grundentscheidung wird dadurch nicht wieder geöffnet.
- Die DOM-Reihenfolge bleibt auf allen Breiten erhalten.

### 3.2 Gemeinsamer Tätigkeitsdatensatz

Tätigkeiten und Wirkungsorte werden fachlich zu einem gemeinsamen wiederholbaren Datensatz zusammengeführt. Ein Eintrag umfasst grundsätzlich:

- Tätigkeit oder Funktion;
- Institution;
- Zeitraum;
- einen oder mehrere Wirkungsorte;
- Beschreibung oder Anmerkung;
- gegebenenfalls Quellen.

Die bestehenden getrennten Strukturen bleiben erhalten, bis Zielschema, Kardinalitäten, Mapping und Rückfallweg festgelegt und mit Testdaten geprüft sind. Die Zusammenführung darf keine bestehenden Informationen verlieren oder implizit neu zuordnen.

### 3.3 Bootstrap

Bootstrap 5.3.2 bleibt während der vollständigen Formularmigration technische Übergangsbasis.

- Keine parallele Bootstrap-Ablösung während der Formularmigration.
- Bestehende Abhängigkeiten von Grid, Utilities, Modal, Collapse und Scrollspy dürfen zunächst weiterverwendet werden.
- Neue neutrale Komponenten dürfen Bootstrap intern vorübergehend mitverwenden.
- Globale Overrides, Sonderklassen und `!important` werden kontrolliert reduziert.
- Erst nach abgeschlossener Formularmigration wird anhand des konsolidierten Komponentenbestands entschieden, ob Bootstrap dauerhaft bleibt, teilweise ersetzt oder vollständig abgelöst wird.

## 4. Nicht verhandelbare Leitplanken

- Keine Big-Bang-Migration des gesamten Formulars.
- Keine neue Framework-, Tailwind-, React- oder technische shadcn/ui-Abhängigkeit.
- Keine Entfernung von Demo- oder Beispieldaten.
- Keine Änderung fachlicher Daten oder Rechte als Nebenwirkung einer UI-Migration.
- Keine ausschließlich visuelle Rollen- oder Feldsperre.
- Nicht freigegebene Daten dürfen produktiv weder geliefert noch exportiert werden; die statische Demo kann dies nur simulieren.
- Kein Entfernen vermeintlich ungenutzten CSS, bevor statisches und dynamisch erzeugtes Markup aller Rollen und Zustände geprüft wurde.
- Keine neue Sonderklasse, wenn ein neutrales Zielmuster den Bedarf abdeckt.
- Jede migrierte Komponente benötigt Tastatur-, Fokus-, Kontrast-, Rollen-, Status- und Responsive-Prüfung.
- Fachliche und visuelle Änderungen werden in getrennten Commits oder eindeutig getrennten Arbeitspaketen umgesetzt.

## 5. Zielzustand der Migration

Nach Abschluss der Formularmigration besitzt die Demo:

- eine korrekte semantische Überschriften- und Formularhierarchie;
- eine responsive Workbench mit abschnittsabhängig einer oder zwei Spalten;
- Design-Tokens für Farben, Typografie, Abstände, Größen, Radien, Schatten, Fokus und Ebenen;
- neutrale, wiederverwendbare Komponenten für Abschnitte, Unterabschnitte, Felder, Datenzeilen, Einträge, Aktionen, Hinweise, Chips, Leerzustände und Dialoge;
- flache statt verschachtelte Kartenstrukturen;
- eine zentrale Rollen- und Sichtbarkeitsmatrix;
- zugängliche Auswahlgruppen, Icon-Aktionen, Dialoge, Autocomplete- und Fehlerzustände;
- einen gemeinsamen wiederholbaren Datensatz für Tätigkeit und Wirkungsort;
- eine statische Komponentenreferenz mit allen Varianten und Zuständen;
- eine dokumentierte Regressionstest-Baseline;
- eine aktuelle Restinventur der Bootstrap-Abhängigkeiten als Grundlage für die nachgelagerte Bootstrap-Entscheidung.

## 6. Phasenübersicht

| Phase | Ziel                                      | Hauptoutput                               | Abschlussbedingung                                 |
| ----- | ----------------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| 0     | Referenz und Testbasis sichern            | Fixtures, Prüfliste, Messwerte            | Ist-Zustand reproduzierbar                         |
| 1     | belegte Defekte stabilisieren             | kleine Korrekturen ohne Redesign          | kritische Baseline-Fehler behoben                  |
| 2     | visuelle und semantische Grundlagen       | Tokens, Breite, Typografie, Fokus         | Basis in Hell/Dunkel und responsiv stabil          |
| 3     | neutrale Kernkomponenten pilotieren       | Lebensdaten und Identität                 | Muster an zwei unterschiedlichen Bereichen bewährt |
| 4     | einfache Anzeige- und Disclosure-Bereiche | Anzeigename und Normdaten                 | Property- und Disclosure-Muster abgenommen         |
| 5     | gemeinsames Tätigkeitsmodell              | Zielschema, Mapping, neue Eintragsliste   | verlustfreie Zusammenführung nachgewiesen          |
| 6     | Quellen, Kommentare und Metadaten         | flache Listen und Threads                 | Rollen und Schreibrechte regressionsfrei           |
| 7     | Navigation und komplexe Interaktionen     | Sidebar, Dialoge, Autocomplete            | vollständige Tastatur- und Fokusführung            |
| 8     | administrative Bereiche und Aktionen      | History, Import, Speichern/Reset/Export   | Berechtigungen und Aktionsfluss konsistent         |
| 9     | Konsolidierung und Dokumentation          | bereinigtes CSS, Referenzseite, Changelog | vollständige Formularmigration abgenommen          |
| 10    | Bootstrap bewerten                        | belastbare Architekturentscheidung        | separate Entscheidung dokumentiert                 |

## 7. Phase 0 – Referenz und Testbasis

### Ziel

Der aktuelle Funktionsumfang wird vor strukturellen Änderungen reproduzierbar dokumentiert.

### Arbeitspakete

1. Commit `eb4544a` als Ausgangsreferenz dokumentieren.
2. `ui-inventory.md`, `design-system.md` und `migration-plan.md` gemeinsam versionieren.
3. Verbindliche Testfälle beziehungsweise Fixtures festlegen für:
   - alle vier Rollen;
   - lebende und verstorbene Person;
   - leere, teilweise und vollständig befüllte Datensätze;
   - lange Namen, IDs, Institutionen, Orte und Kommentare;
   - EDTF Jahr, Monat, Tag, unbekannte Stellen, Qualifier, Intervalle, offene und ungültige Werte;
   - 0, 1 und mehrere wiederholbare Einträge.
4. Ausgangsmesswerte erfassen:
   - Cards, Badges, Buttons und `!important`;
   - globale Bootstrap-Overrides;
   - kritische Kontrast- und Accessibility-Befunde;
   - externe Laufzeitabhängigkeiten;
   - sichtbare und dynamisch erzeugte Komponentenvarianten.
5. Manuelle Regressionstest-Checkliste im Repository anlegen.

### Abnahme

- Jeder kritische Rollen-, Lebensstatus-, EDTF-, Listen-, Export- und Resetfall ist nachvollziehbar beschrieben.
- Die Testdaten decken Minimal-, Normal- und Extremzustände ab.
- Noch keine visuelle oder fachliche Migration wurde durchgeführt.

## 8. Phase 1 – Bestand stabilisieren

### Ziel

Eindeutig belegte Defekte werden behoben, ohne Komponenten oder Layout grundlegend umzubauen.

### Arbeitspakete

1. `alert-sec ondary` korrigieren.
2. ORCID-Interpolation im Anzeigenamen korrigieren.
3. unzureichende Kontraste der Pastellbuttons und Lebensstatusoptionen beheben;
4. statische und dynamisch erzeugte Icon-only-Buttons zugänglich benennen;
5. englische Beschriftungen innerhalb der deutschen Oberfläche vereinheitlichen;
6. Reset-Reihenfolge so absichern, dass Rollen- und Statusgates unmittelbar konsistent bleiben;
7. Record-Viewer-Regeln als Regression festschreiben:
   - verstorben: nur Anzeigename und vorhandene Kommentare;
   - lebend: zusätzlich Vorname, Nachname und Quellen;
   - stets read-only;
   - keine Metadaten, History, Importrohdaten, Speicherung, Änderung, Reset oder Export;
8. Validierung verborgener und nicht bearbeitbarer Felder ausschließen;
9. Abhängigkeit und Verhalten bei Ausfall der CDNs dokumentieren.

### Nicht Bestandteil

- Migration von Cards, Listen oder Abschnittsstrukturen;
- formularweite CSS-Bereinigung;
- Bootstrap-Ablösung;
- fachliche Zusammenführung von Tätigkeit und Wirkungsort.

### Abnahme

- Alle Phase-0-Regressionen bleiben funktionsfähig.
- Alle sichtbaren Aktionen besitzen einen eindeutigen Namen.
- Normaler Text und Controls erfüllen mindestens WCAG AA.
- Rollenwechsel hinterlassen keine unzulässigen sichtbaren oder fokussierbaren Controls.

## 9. Phase 2 – Grundlagen vereinheitlichen

### Ziel

Die visuelle, semantische und responsive Basis wird eingeführt, ohne komplexe Fachkomponenten gleichzeitig umzubauen.

### Arbeitspakete

1. semantische Design-Tokens aus `design-system.md` in `styles.css` einführen;
2. Produkttokens kontrolliert auf weiterhin benötigte Bootstrap-Variablen abbilden;
3. CSS-Schichten beziehungsweise eine dokumentierte Reihenfolge für Basis, Layout, Komponenten, Utilities und Übergangsregeln herstellen;
4. genau ein `h1` und eine konsistente `h1`–`h4`-Hierarchie einführen;
5. globale `:focus-visible`-Regel und komponentenkonsistente Fokuszustände ergänzen;
6. Controlhöhen, Labels, Hilfetexte, Fehler und Abstände vereinheitlichen;
7. `.has-value` als grünen Befüllungszustand entfernen;
8. 800px-Inline-Begrenzung entfernen und responsive Workbench bis ungefähr 70rem einführen;
9. Container-Query-Schwelle mit realen Inhalten testen;
10. ein- und zweispaltige Layout-Primitives bereitstellen;
11. Button-, Icon-Button- und Notice-Grundvarianten einführen;
12. Hell-, Dunkel- und Forced-Colors-Darstellung gegenprüfen.

### Layoutabnahme

- Geburt und Tod stehen nur bei ausreichend verfügbarer Breite nebeneinander.
- Komplexe und wiederholbare Datensätze bleiben einspaltig.
- Kein horizontaler Seitenüberlauf bei 320, 375, 576, 768, 1024, 1280 und 1440px.
- Lange Werte verursachen weder abgeschnittene Controls noch überlagerte Aktionen.
- Die Sidebar beeinträchtigt die nutzbare Mindestbreite des Formulars nicht.

## 10. Phase 3 – Kernkomponenten pilotieren

### 10.1 Lebensdaten als Referenzpilot

Der bereits neutralisierte Lebensdatenbereich wird vervollständigt, nicht neu erfunden.

- `.form-subsection`, `.compact-value-grid`, `.form-empty-state` und `.repeatable-entry` auf Zielbenennung und Komponentenvertrag prüfen;
- EDTF-Interpretation aus dem Monospace-/`code`-Kontext lösen; nur der EDTF-Rohwert bleibt Code;
- Datenzeile, Leerzustand, Aktionsspalte und wiederholbarer Eintrag vereinheitlichen;
- EDTF-Dialoge, Add/Edit/Cancel/Delete und Fokus-Rückkehr regressionsprüfen;
- Geburt/Tod anhand der neuen Containerbreite responsiv schalten.

### 10.2 Identität als zweiter Pilot

Identität prüft, ob das System auch für klassische Eingabefelder funktioniert.

- Radio-Gruppen mit `fieldset` und `legend` auszeichnen;
- Feldraster und Hilfetexte auf neutrale Field-Komponente umstellen;
- Titel- und Namensvarianten-Aktionen vereinheitlichen;
- dynamische Kurzzeilen auf ein gemeinsames Render- und Löschmuster bringen;
- Read-only-, verborgen-, deaktiviert- und Fehlerzustände sauber trennen.

### Abnahme

- Beide Piloten verwenden dieselben Tokens, Buttons, Fokus- und Fehlerregeln.
- Statisches und dynamisch erzeugtes Markup besitzen dieselbe Anatomie.
- Keine neue bereichsspezifische Sonderlösung wurde eingeführt.
- Erst nach Abnahme beider Piloten darf das Muster auf weitere Bereiche übertragen werden.

## 11. Phase 4 – Anzeigename und Normdaten

### Arbeitspakete

1. Anzeigename vom Bootstrap-Alert in eine semantische berechnete Datenzeile beziehungsweise `<output>` überführen.
2. Suffixe und Normdaten als ruhige Label-Wert-Strukturen darstellen.
3. externe Links, IDs, Kopier- und Bearbeitungsaktionen nach dem Icon-Button-Vertrag vereinheitlichen.
4. Normdaten-Accordion als nativen `<details>/<summary>`-Pilot prüfen und nur bei vollständiger Funktionsgleichheit ersetzen.
5. unbekannt, leer, nicht vorhanden und verborgen visuell und semantisch unterscheiden.

### Abnahme

- Normale Datenwerte verwenden keine Alertsemantik.
- IDs und lange Werte brechen kontrolliert um.
- Disclosure ist per Tastatur und Screenreader verständlich.
- Record-Viewer-Freigaben bleiben unverändert.

## 12. Phase 5 – Tätigkeiten und Wirkungsorte zusammenführen

Diese Phase enthält eine fachliche Datenmigration und wird deshalb in zwei getrennte Teilphasen gegliedert.

### 12.1 Fachliches Zielschema und Mapping

Vor jeder UI-Umstellung sind verbindlich festzulegen:

- Felddefinitionen und Kardinalitäten;
- Pflicht- und optionale Felder;
- Kardinalität der Wirkungsorte und Quellen;
- Semantik leerer, unbekannter und historisch unvollständiger Angaben;
- Umgang mit widersprüchlichen Zeiträumen, Institutionen und Rollen;
- Identifikatoren für bestehende Einträge;
- Mapping jedes bestehenden Tätigkeits- und Wirkungsortfeldes;
- Regeln für eindeutige, mehrdeutige und nicht automatisch zuordenbare Altbestände;
- Testdatensatz und erwartetes Migrationsergebnis;
- Rückfall- beziehungsweise Wiederholungsstrategie.

### 12.2 UI- und JavaScript-Migration

1. gemeinsamen wiederholbaren Eintrag als flaches `<article class="ui-entry">` umsetzen;
2. Tätigkeit, Institution, Zeitraum, Wirkungsort(e), Beschreibung und Quellen in einer kohärenten Anatomie anordnen;
3. bestehende Autocomplete- und EDTF-Funktionen integrieren;
4. Add, Edit, Cancel und Delete zentral rendern und behandeln;
5. Metadaten nicht als dekorative Badges, sondern als Properties darstellen;
6. parallele Altansichten erst entfernen, nachdem Mappings und Regressionen vollständig bestanden sind.

### Abnahme

- Jeder Altwert ist im Ziel entweder eindeutig erhalten oder als manueller Klärfall ausgewiesen.
- Anzahl und Identität der migrierten Einträge sind nachvollziehbar.
- Keine automatische Zusammenführung beruht nur auf visueller Nähe oder gleicher Beschriftung.
- 0, 1 und n Tätigkeiten sowie 0, 1 und n Wirkungsorte funktionieren.
- Zeitraum-, Institution-, Rollen-, Quellen- und Autocomplete-Funktionen bleiben erhalten.
- Ein dokumentierter Rückfallweg existiert.

## 13. Phase 6 – Quellen, Kommentare und Metadaten

### Quellen

- Kartenverschachtelung durch flache wiederholbare Einträge ersetzen;
- Detailwerte als semantisches `dl` beziehungsweise Property Grid darstellen;
- Quellenaktionen nach zentralem Button-/Dialogvertrag umsetzen;
- Quellen im gemeinsamen Tätigkeitsdatensatz und allgemeine Personenquellen fachlich unterscheiden.

### Kommentare und Anmerkungen

- verschachtelte Cards durch flache Threadstruktur ersetzen;
- Autor, Zeit, Text, Antwortbezug und erlaubte Aktionen klar auszeichnen;
- `<time datetime>` für Zeitangaben verwenden;
- Rollenbadges nur anzeigen, wenn sie fachlich relevant sind;
- Record-Viewer strikt read-only halten.

### Abnahme

- Rollenabhängige Schreibaktionen sind tatsächlich deaktiviert oder nicht gerendert.
- Kommentar- und Quellenmodale geben den Fokus korrekt zurück.
- Leere und mehrstufige Threads sind verständlich.
- Viewerfälle für lebende und verstorbene Personen bleiben exakt erhalten.

## 14. Phase 7 – Navigation und komplexe Interaktionen

### Arbeitspakete

1. Rollenwahl als klar markierte Demo-Toolbar aus der fachlichen Formularhierarchie herauslösen.
2. Sidebar und Scrollspy für breite Arbeitsflächen konsolidieren.
3. kompakte Navigation für schmale Ansichten umsetzen.
4. alle Bootstrap-Modale auf eine gemeinsame Dialoganatomie, deutsche Labels, Fokusfalle und Fokus-Rückkehr prüfen.
5. Autocomplete zu einem vollständigen ARIA-Combobox-Muster ausbauen:
   - `combobox`, `listbox`, `option`;
   - `aria-expanded`, `aria-controls`, `aria-activedescendant`;
   - Pfeiltasten, Enter, Escape und Fokusmanagement;
   - klare Semantik für Freitext gegenüber verbindlicher Normauswahl.
6. Tooltip-Nutzung auf ergänzende Information beschränken.

### Abnahme

- Die gesamte Oberfläche ist ohne Maus bedienbar.
- Sichtbare Fokusreihenfolge entspricht der DOM- und Lesereihenfolge.
- Verborgene Abschnitte erscheinen nicht in Navigation oder Tabreihenfolge.
- Dialoge schließen mit Escape, geben Fokus zurück und besitzen eindeutige Titel.
- Autocomplete funktioniert mit Tastatur und Assistenztechnologien.

## 15. Phase 8 – Administrative Bereiche und globale Aktionen

### Arbeitspakete

1. Record History als semantische, responsive Audit-Tabelle modernisieren.
2. Status-Chips auf fachlich begründete Varianten reduzieren.
3. Importdaten und JSON-LD als administrativen Data Viewer strukturieren.
4. Rohdaten mit `<pre><code>`, kontrolliertem Umbruch/Scrollen und zugänglicher Copy-Aktion darstellen.
5. Speichern, Reset und Export in einer konsistenten Aktionszone anordnen.
6. Fehlerübersicht mit Links beziehungsweise Fokusführung zu ungültigen Feldern ergänzen.
7. Schutz vor ungespeicherten Änderungen erst nach Festlegung der Speichersemanik umsetzen.
8. zentrale deklarative Permission Matrix für Sichtbarkeit, Read-only, Aktionen, Validierung und Export einführen.

### Abnahme

- Record-Viewer sieht weder Metadaten, History noch Importrohdaten und kann keine globalen Aktionen ausführen.
- Andere Rollen behalten ihre bisherigen Rechte.
- Export enthält nur für die jeweilige Rolle freigegebene Daten.
- Fehlerübersicht und Feldfehler sind konsistent verknüpft.
- Die clientseitige Demo weist weiterhin ausdrücklich auf die fehlende serverseitige Zugriffskontrolle hin.

## 16. Phase 9 – Konsolidierung und Abschluss der Formularmigration

### Arbeitspakete

1. statische Komponentenreferenz für alle Komponenten, Varianten und Zustände erstellen;
2. verbliebene Card-, Alert-, Badge- und Button-Sondervarianten inventarisieren und begründet migrieren oder dokumentieren;
3. ungenutztes CSS erst nach Analyse aller HTML- und JavaScript-Renderpfade entfernen;
4. `!important` und globale Bootstrap-Overrides reduzieren;
5. Inline-Styles und fachlich relevante Inline-Skripte kontrolliert in die vorgesehenen Dateien überführen;
6. Dark-Mode-Direktwerte durch semantische Tokens ersetzen;
7. lokale Bereitstellung oder dokumentiertes Ausfallverhalten für Bootstrap, Icons und EDTF entscheiden;
8. Browsermatrix, Accessibility- und Responsive-Regressionslauf durchführen;
9. `ui-inventory.md`, `design-system.md`, Migrationsmatrix und Changelog aktualisieren.

### Abschlusskriterien der Formularmigration

- Alle 13 Ausgangsabschnitte sind migriert oder mit begründeter Ausnahme dokumentiert.
- Keine nicht dokumentierten Komponentenvarianten bleiben bestehen.
- Keine kritischen Accessibility- oder Kontrastverstöße sind offen.
- Alle Rollen-, Lebensstatus-, EDTF-, Listen-, Validierungs- und Aktionsregressionen bestehen.
- Dynamisches und statisches Markup verwenden dieselben Komponentenverträge.
- Die gemeinsame Tätigkeitsstruktur ist fachlich und technisch abgenommen.
- Die Anwendung bleibt ohne Buildschritt als statisches HTML/CSS/JavaScript ausführbar.

## 17. Phase 10 – Bootstrap erst nach der Formularmigration bewerten

Diese Phase ist eine Architekturprüfung, keine vorweggenommene Ablösung.

### Zu erheben

- verbleibende Bootstrap-CSS-Klassen nach Bereich;
- verbleibende Grid- und Utility-Nutzung;
- aktive Bootstrap-JavaScript-Komponenten;
- Umfang eigener Overrides;
- Dateigröße und Ladeabhängigkeiten;
- Accessibility- und Wartungskosten eines Ersatzes;
- Aufwand und Nutzen der drei Optionen.

### Entscheidungsoptionen

| Option              | Voraussetzung                                                                         | Konsequenz                           |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| dauerhaft behalten  | geringe problematische Kopplung, stabile Komponenten                                  | Bootstrap bleibt dokumentierte Basis |
| teilweise ersetzen  | einzelne JS-/Layoutbereiche verursachen unverhältnismäßige Kopplung                   | gezielte Entkopplungsphase           |
| vollständig ablösen | keine unersetzte JS-Abhängigkeit, geringe Utility-Nutzung, vollständige Referenztests | separates, neu zu planendes Projekt  |

Die Entscheidung benötigt eine nachvollziehbare Aufwand-Nutzen-Bewertung. Sie ist nicht Bestandteil der Abnahme der Formularmigration.

## 18. Formularweite Regressionstest-Matrix

| Dimension           | Pflichtfälle                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Rollen              | DB-Owner, Record-Owner, Record-Editor, Record-Viewer                                           |
| Viewer              | lebend, verstorben, Rollenwechsel, strikt read-only                                            |
| Lebensstatus        | unbekannt, lebend, verstorben, Statuswechsel                                                   |
| EDTF                | leer, Jahr, Monat, Tag, unbekannte Stellen, Qualifier, Intervall, offen, ungültig, Chronologie |
| Wiederholbare Daten | 0, 1, n; Add, Edit, Cancel, Delete                                                             |
| Tätigkeitsmigration | eindeutig, mehrdeutig, nicht zuordenbar, mehrere Orte und Quellen                              |
| Validierung         | leer, gültig, ungültig, verborgene Pflichtfelder, Fehlerübersicht                              |
| Aktionen            | Speichern, Reset, Export, Copy; erlaubt und blockiert                                          |
| Tastatur            | Tab, Shift+Tab, Pfeile, Enter, Leertaste, Escape, Fokus-Rückkehr                               |
| Darstellung         | Hell, Dunkel, Forced Colors, Reduced Motion                                                    |
| Breiten             | 320, 375, 576, 768, 1024, 1280, 1440px                                                         |
| Inhalte             | lange Namen, IDs, Institutionen, Orte, Interpretationen und Kommentare                         |
| Abhängigkeiten      | Ausfall von Bootstrap-CSS/JS, Icons und EDTF-Modul                                             |
| Browser             | freigegebene Versionen von Chromium, Firefox und Safari                                        |

## 19. Freigaberegel pro Arbeitspaket

Ein Arbeitspaket gilt nur als abgeschlossen, wenn:

1. sein Umfang und seine Nicht-Ziele dokumentiert sind;
2. statisches und dynamisch erzeugtes Markup geprüft wurden;
3. betroffene Rollen und Lebensstatus getestet wurden;
4. Tastatur, Fokus, Namen, Kontrast und Responsive-Verhalten geprüft wurden;
5. keine fachliche Nebenwirkung festgestellt wurde;
6. neue Komponenten in der Referenzseite dokumentiert sind;
7. verbleibende Einschränkungen und technische Schulden festgehalten sind;
8. Inventur, Migrationsmatrix oder Changelog bei materiellen Änderungen aktualisiert wurden.

## 20. Risiken und Gegenmaßnahmen

| Risiko                                                  | Gegenmaßnahme                                                              | Blockiert                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| dynamisch erzeugtes Markup wird übersehen               | Renderpfade in `form.js` und `edtf-component.js` gemeinsam mit HTML prüfen | CSS-Entfernung               |
| Bootstrap-Overrides verursachen Seiteneffekte           | neue Komponenten scopen, schrittweise migrieren, Referenztests             | jeweilige Komponente         |
| Rollenwechsel lässt Daten oder Fokus zurück             | zentrale Permission Matrix und Wechseltests                                | Rollenabnahme                |
| clientseitige Sperre wird als Sicherheit missverstanden | produktiv serverseitig bei Abruf, Speicherung und Export erzwingen         | Produktiveinsatz             |
| Tätigkeitsdaten werden falsch zusammengeführt           | Zielschema, explizites Mapping, Klärfälle und Rückfallweg                  | Phase 5.2                    |
| Container Query wird zu früh festgelegt                 | reale Extremwerte und Sidebarbreite im Pilot testen                        | Layoutabnahme                |
| Redesign und Fachänderung vermischen sich               | getrennte Arbeitspakete und Commits                                        | Freigabe                     |
| CSS wird voreilig gelöscht                              | erst nach vollständiger dynamischer Analyse und Regression                 | Phase 9                      |
| CDN-Ausfall bricht Kernfunktionen                       | Ausfalltests und Entscheidung zur lokalen Bereitstellung                   | Abschluss bei Offlinepflicht |
| Bootstrap-Ablösung verdrängt Formularmigration          | Bewertung ausdrücklich erst in Phase 10                                    | Bootstrap-Arbeiten           |

## 21. Noch offene Entscheidungen und Gates

Die drei Grundsatzfragen zu Layout, Tätigkeitsmodell und Bootstrap sind entschieden. Offen bleiben nur konkretisierende Fragen:

| Entscheidung                                               | Spätester Zeitpunkt  | Blockiert                        |
| ---------------------------------------------------------- | -------------------- | -------------------------------- |
| genaue Maximalbreite und Container-Schwelle                | Phase 2 Layout-Pilot | Layoutabnahme                    |
| Kardinalitäten und Pflichtfelder des Tätigkeitsdatensatzes | vor Phase 5.2        | Tätigkeits-UI und Datenmigration |
| Freitext versus verbindliche Normauswahl im Autocomplete   | vor Phase 7          | Combobox-Endabnahme              |
| produktive Speichersemantik                                | vor Phase 8          | Aktionszone und Dirty State      |
| serverseitige Autorisierung und Auditierung                | vor Produktiveinsatz | produktive Freigabe              |
| institutionelle Browser- und Offlineanforderungen          | spätestens Phase 9   | Abschlussprüfung                 |
| produktive Rolle des Dark Mode                             | spätestens Phase 9   | Theme-Konsolidierung             |
| Such- und Filteranforderungen späterer Listen              | separates Vorhaben   | nicht das Datensatzformular      |

Offene Detailentscheidungen blockieren nur die jeweils genannten Arbeitspakete. Sie öffnen die drei verbindlichen Architekturentscheidungen nicht erneut.

## 22. Dokumentation und Fortschrittssteuerung

Nach jeder Phase werden mindestens aktualisiert:

- Status der Arbeitspakete und Abnahmekriterien in diesem Plan;
- betroffene Einträge der Migrationsmatrix;
- neue oder beseitigte technische Schulden in `ui-inventory.md`;
- Komponentenregeln in `design-system.md`, falls sich ein begründeter Zielbedarf geändert hat;
- Komponentenreferenz und Changelog;
- Messwerte für Cards, Badges, `!important`, Bootstrap-Overrides und offene Accessibility-Befunde.

Empfohlener Status je Arbeitspaket: `offen`, `in Arbeit`, `blockiert`, `zur Abnahme`, `abgenommen`.

## 23. Nächster konkreter Schritt

Als nächstes werden ausschließlich Phase 0 und anschließend Phase 1 umgesetzt. Die erste Implementierungsrunde umfasst Baseline und eindeutig belegte Defekte; sie enthält noch keine formularweite Komponenten- oder Layoutmigration.

Erst nach deren Abnahme beginnt Phase 2 mit Tokens, Typografie, Fokus, Controlgrößen und der beschlossenen flexiblen Workbench-Breite.
