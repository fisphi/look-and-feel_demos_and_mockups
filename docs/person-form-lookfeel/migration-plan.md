# Vereinfachter Migrationsplan für das Personenformular

Stand: 1. August 2026
Bereich: `docs/person-form-lookfeel`

## 1. Ziel

Das bestehende Personenformular wird schrittweise an das neue Designsystem angepasst.

Es handelt sich ausschließlich um eine statische HTML-Demo. Ziel ist eine visuell konsistente und funktionierende Präsentation der wichtigsten Komponenten. Eine produktionsreife Migration, vollständige Datenmodellierung oder umfassende technische Absicherung ist nicht erforderlich.

Die Demo bleibt mit HTML, CSS und Vanilla JavaScript ohne Buildprozess ausführbar.

## 2. Grundlagen

Als Referenz dienen:

- `index.html`
- `styles.css`
- `form.js`
- `edtf-component.js`
- `ui-inventory.md`
- `design-system.md`

Das bestehende Formular liefert die fachlichen Inhalte und Interaktionen. Das Designsystem gibt die visuelle Richtung vor.

Bootstrap darf weiterverwendet werden, sofern dies die Umsetzung vereinfacht. Eine Ablösung von Bootstrap ist nicht Teil der Demo.

## 3. Leitlinien

- Bestehende Funktionen möglichst erhalten.
- Keine neue Framework- oder Build-Abhängigkeit einführen.
- Keine vollständige Neuentwicklung des Formulars.
- Bestehende Komponenten schrittweise vereinheitlichen.
- Bereichsspezifische Sonderlösungen vermeiden.
- Die Demo muss auf Desktop und mobilen Ansichten sinnvoll funktionieren.
- Rollen, EDTF und wiederholbare Einträge müssen lediglich nachvollziehbar demonstriert werden.
- Produktive Sicherheits-, Export- und Datenmigrationsanforderungen sind nicht Bestandteil.

## 4. Migrationsschritte

### Schritt 1 – Grundlayout und Design-Tokens

Zunächst werden die allgemeinen Gestaltungsgrundlagen vereinheitlicht:

- Farben
- Typografie
- Abstände
- Radien
- Rahmen
- Fokuszustände
- Controlhöhen
- Buttonvarianten
- maximale Formularbreite

Die bisherige starre Breite wird durch eine responsive Formularbreite ersetzt.

Das Formular bleibt grundsätzlich einspaltig. Kurze, zusammengehörige Bereiche wie Geburt und Tod dürfen auf breiten Ansichten zweispaltig dargestellt werden.

### Schritt 2 – Neutrale Formularkomponenten

Danach werden wiederverwendbare Grundmuster eingeführt:

- Formularabschnitt
- Unterabschnitt
- klassisches Eingabefeld
- Select
- Radio-Gruppe
- Hinweis
- Leerzustand
- Datenzeile
- wiederholbarer Eintrag
- Aktionszeile
- Icon-Button

Die Komponenten sollen unabhängig vom jeweiligen Fachbereich funktionieren.

### Schritt 3 – Lebensdaten als Referenz

Der Bereich Lebensdaten dient als erste Referenz für:

- Unterabschnitte
- kompakte Datenfelder
- EDTF-Eingaben
- wiederholbare Einträge
- Leerzustände
- Bearbeiten- und Löschen-Aktionen
- responsive Darstellung von Geburt und Tod

Die vorhandenen neutralen Regeln werden beibehalten und nur bei Bedarf vereinfacht oder vereinheitlicht.

### Schritt 4 – Identität und Namen

Anschließend werden die gleichen Komponentenregeln auf klassische Formularfelder übertragen:

- Vorname
- Nachname
- Titel
- Geschlecht beziehungsweise Anrede
- Namensvarianten
- Radio-Gruppen
- Hilfetexte
- dynamisch hinzugefügte Einträge

Damit wird geprüft, ob das Designsystem nicht nur für Lebensdaten, sondern auch für normale Formularelemente funktioniert.

### Schritt 5 – Weitere Formularbereiche übertragen

Nach Lebensdaten und Identität werden die übrigen Bereiche nach demselben Muster angepasst:

- Anzeigename
- Normdaten
- Tätigkeiten
- Wirkungsorte
- Quellen
- Kommentare
- Metadaten
- administrative Informationen

Dabei ist keine vollständige fachliche Neuordnung erforderlich.

Tätigkeiten und Wirkungsorte können in der Demo als gemeinsamer wiederholbarer Eintrag dargestellt werden. Eine echte Datenmigration, ein verbindliches Zielschema oder ein vollständiges Mapping der Altdaten ist nicht notwendig.

Ein Eintrag kann beispielhaft enthalten:

- Tätigkeit oder Funktion
- Institution
- Zeitraum
- Wirkungsort
- Beschreibung
- Quelle

### Schritt 6 – Navigation und Dialoge

Zum Abschluss werden die übergreifenden Interaktionen vereinheitlicht:

- Seitennavigation
- Rollenwahl
- Dialoge
- Autocomplete
- Speichern
- Reset
- Export
- mobile Darstellung

Für die Demo genügt eine funktionierende und verständliche Tastaturbedienung. Eine vollständige produktive Accessibility-Zertifizierung ist nicht erforderlich.

### Schritt 7 – Bereinigung

Nach der visuellen Umstellung werden offensichtliche Altlasten entfernt:

- nicht mehr verwendete Sonderklassen
- doppelte CSS-Regeln
- überflüssige Inline-Styles
- inkonsistente Buttons
- unnötige Card-Verschachtelungen
- übermäßige Verwendung von Badges und Alerts

Eine vollständige Analyse jedes dynamischen Renderpfads ist für die Demo nicht notwendig. Entfernt werden nur Regeln, die eindeutig nicht mehr verwendet werden.

## 5. Vereinfachte Abnahme

Die Demo gilt als ausreichend migriert, wenn:

- das Formular visuell einheitlich wirkt;
- Lebensdaten, klassische Eingabefelder, Radio-Gruppen, Titel und Namensvarianten dieselben Komponentenregeln verwenden;
- wiederholbare Einträge einheitlich dargestellt werden;
- Geburt und Tod responsiv funktionieren;
- Buttons, Leerzustände und Hinweise konsistent sind;
- die wichtigsten Rollenansichten nachvollziehbar funktionieren;
- EDTF-Eingaben weiterhin demonstriert werden können;
- keine offensichtlichen Layoutfehler auftreten;
- die Anwendung weiterhin direkt als statische HTML-Seite geöffnet werden kann.

## 6. Nicht erforderlich

Für diese Demo sind ausdrücklich nicht erforderlich:

- vollständige fachliche Datenmigration;
- verlustfreies Mapping bestehender Tätigkeiten und Wirkungsorte;
- Rückfall- oder Wiederholungsstrategie;
- produktive serverseitige Berechtigungsprüfung;
- vollständige Browsermatrix;
- vollständige WCAG-Prüfung;
- Forced-Colors- und Offline-Abnahme;
- umfassende Messwerte und Fortschrittsberichte;
- separate Architekturentscheidung zu Bootstrap;
- Komponentenreferenz für jede denkbare Variante;
- formale Freigaben nach jeder einzelnen Phase.

## 7. Empfohlene Umsetzungsreihenfolge

1. Grundlayout und Tokens
2. neutrale Formularkomponenten
3. Lebensdaten
4. Identität, Titel und Namensvarianten
5. weitere Formularbereiche
6. Navigation und Dialoge
7. CSS-Bereinigung

Die Umsetzung kann direkt komponentenweise erfolgen. Separate Planungs-, Freigabe- und Dokumentationsphasen sind für die Demo nicht erforderlich.

## 8. Nächster Schritt

Als Nächstes werden die bereits bei den Lebensdaten eingeführten neutralen Komponentenregeln auf folgende Bereiche übertragen:

- klassische Eingabefelder
- Radio-Gruppen
- Titel
- Namensvarianten

Danach können die gleichen Muster ohne weitere Planungsphase schrittweise auf die restlichen Formularbereiche angewendet werden.
