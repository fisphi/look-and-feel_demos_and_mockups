# Vereinfachtes Designsystem für das Personenformular

Status: Arbeitsgrundlage für die statische Demo
Geltungsbereich: `docs/person-form-lookfeel`
Technik: HTML, CSS, Vanilla JavaScript; kein Buildprozess

## 1. Zweck

Dieses Dokument legt die grundlegenden Gestaltungsregeln für die statische Demo des Personenformulars fest.

Ziel ist keine vollständige produktive Designsystem-Architektur, sondern eine konsistente visuelle und technische Grundlage für die bestehenden Demo-Komponenten.

Das Formular soll:

- ruhig und übersichtlich wirken;
- wissenschaftliche Daten kompakt darstellen;
- klassische Formularfelder und komplexere Datensätze einheitlich behandeln;
- auf Desktop und kleineren Ansichten sinnvoll funktionieren;
- weiterhin direkt als statische HTML-Seite ausführbar bleiben.

## 2. Gestaltungsrichtung

Die visuelle Richtung kombiniert:

- Linear für Navigation, Listen, Suche, Filter und die allgemeine visuelle Sprache;
- Vercel für klar strukturierte Formulare und administrative Bereiche;
- Notion für Eigenschaften, Beziehungen, Normdaten und redaktionelle Inhalte;
- shadcn/ui als Orientierung für Komponentenaufbau, Größen und Zustände.

Die Referenzen werden nur gestalterisch verwendet. Es werden keine zusätzlichen Frameworks oder Komponentenbibliotheken eingebunden.

Der Stil soll sachlich, reduziert, kompakt und modern sein.

## 3. Technische Grundlage

Die Demo bleibt eine statische Anwendung mit:

- semantischem HTML;
- CSS;
- Vanilla JavaScript;
- optional weiterhin Bootstrap;
- Bootstrap Icons;
- bestehender EDTF-Komponente.

Bootstrap darf dort weiterverwendet werden, wo es die Umsetzung vereinfacht. Eine vollständige Ablösung ist für die Demo nicht vorgesehen.

Es werden keine neuen Abhängigkeiten wie React, Vue, Tailwind oder eine Build-Pipeline eingeführt.

## 4. Grundprinzipien

- Bestehende Funktionen und Beispieldaten bleiben erhalten.
- Neue Komponenten sollen möglichst neutral und wiederverwendbar sein.
- Fachbereichsspezifische Sonderklassen werden vermieden.
- Verschachtelte Cards werden reduziert.
- Normale Datenwerte werden nicht als Alerts dargestellt.
- Badges und Farben werden sparsam eingesetzt.
- Visuelle Hierarchie entsteht primär durch Typografie, Abstand, Nähe und Trennlinien.
- Icons ergänzen Beschriftungen, ersetzen sie aber nicht unnötig.
- Read-only-Daten werden möglichst als Textwerte statt als deaktivierte Inputs dargestellt.
- Befüllte Felder erhalten nicht automatisch eine grüne Erfolgsdarstellung.

## 5. Basis-Tokens

Für die Demo genügt ein kleiner Satz semantischer CSS-Variablen.

```css
:root {
  color-scheme: light;

  --color-background: #f7f8fa;
  --color-surface: #ffffff;
  --color-surface-subtle: #f3f5f7;

  --color-text: #182026;
  --color-text-muted: #66717b;

  --color-border: #d9dfe5;
  --color-border-strong: #b8c1ca;

  --color-accent: #2563a6;
  --color-accent-hover: #1f548e;
  --color-accent-subtle: #eaf2fb;

  --color-danger: #b42336;
  --color-danger-subtle: #fcecef;

  --color-success: #237a45;
  --color-success-subtle: #e9f6ee;

  --color-warning: #8a5a00;
  --color-warning-subtle: #fff5d8;

  --color-focus: #0b6bcb;

  --font-sans:
    system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;

  --control-height: 2.5rem;
  --icon-button-size: 2.25rem;

  --content-width-form: 70rem;
  --sidebar-width: 15rem;

  --shadow-subtle: 0 1px 2px rgb(16 24 40 / 0.06);
  --shadow-dialog: 0 16px 48px rgb(16 24 40 / 0.18);
}
```

Für den Dark Mode dürfen nur die wichtigsten Farbwerte überschrieben werden.

```css
[data-bs-theme="dark"] {
  color-scheme: dark;

  --color-background: #0f1317;
  --color-surface: #151a1f;
  --color-surface-subtle: #1b2127;

  --color-text: #f0f3f5;
  --color-text-muted: #a9b2ba;

  --color-border: #343d46;
  --color-border-strong: #4b5661;

  --color-accent: #75aee8;
  --color-accent-hover: #91bff0;
  --color-accent-subtle: #182b3e;

  --color-focus: #8bc4ff;
}
```

## 6. Typografie

Die Demo verwendet die Systemschrift.

Empfohlene Hierarchie:

| Element   | Verwendung                      | Darstellung    |
| --------- | ------------------------------- | -------------- |
| `h1`      | Seitentitel                     | 24px, semibold |
| `h2`      | Hauptabschnitt                  | 20px, semibold |
| `h3`      | Unterabschnitt                  | 18px, semibold |
| Feldlabel | Eingabefeld                     | 14px, medium   |
| Feldwert  | Daten und Eingaben              | 14–16px        |
| Hilfetext | Ergänzende Information          | 14px, gedämpft |
| Code/ID   | EDTF, Identifikatoren, Rohdaten | Monospace      |

Es soll genau einen Seitentitel geben. Überschriften werden nach ihrer inhaltlichen Ebene verwendet und nicht nur wegen ihrer Schriftgröße.

## 7. Layout

Das Formular verwendet eine responsive Arbeitsbreite bis ungefähr `70rem`.

```css
.person-form {
  width: min(100%, var(--content-width-form));
  margin-inline: auto;
}
```

Grundsätzlich bleibt das Formular einspaltig.

Zweispaltige Darstellung ist nur für kurze und eng zusammengehörige Bereiche sinnvoll, beispielsweise:

- Geburt und Tod;
- Vorname und Nachname;
- kurze Datums- oder Statusfelder.

Komplexe und wiederholbare Datensätze bleiben einspaltig.

Auf schmalen Ansichten werden alle Bereiche untereinander dargestellt.

Die visuelle Reihenfolge muss der HTML-Reihenfolge entsprechen.

## 8. Hauptabschnitte

Jeder Hauptbereich verwendet dieselbe Grundstruktur.

```html
<section class="ui-section" aria-labelledby="section-identitaet">
  <header class="ui-section__header">
    <h2 id="section-identitaet">Identität</h2>
    <p class="ui-section__description">Grundlegende Angaben zur Person.</p>
  </header>

  <div class="ui-section__body">…</div>
</section>
```

Empfohlene Darstellung:

```css
.ui-section {
  margin-block-end: var(--space-10);
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.ui-section__header {
  margin-block-end: var(--space-6);
}

.ui-section__description {
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
}
```

Es gibt nur einen äußeren Container pro Hauptabschnitt. Innere Bereiche werden nicht erneut unnötig als Cards dargestellt.

## 9. Unterabschnitte

Unterabschnitte gliedern zusammengehörige Felder.

```html
<section class="ui-subsection">
  <h3 class="ui-subsection__title">Geburt</h3>
  <div class="ui-subsection__body">…</div>
</section>
```

Sie verwenden Abstand und bei Bedarf eine dünne Trennlinie, aber keinen zusätzlichen Schatten.

Dieses Muster gilt unter anderem für:

- Geburt;
- Tod;
- Titel;
- Namensvarianten;
- Normdaten;
- Quellen;
- Metadaten.

## 10. Formularkomponente

Klassische Eingabefelder verwenden dieselbe Struktur.

```html
<div class="ui-field">
  <label class="ui-field__label" for="first-name"> Vorname </label>

  <input
    class="form-control ui-field__control"
    id="first-name"
    name="first-name"
    type="text"
  />

  <div class="ui-field__help">Bitte den bevorzugten Vornamen eintragen.</div>
</div>
```

Regeln:

- Jedes Feld besitzt ein sichtbares Label.
- Platzhalter ersetzen kein Label.
- Hilfetexte stehen direkt beim Feld.
- Fehlertexte stehen unter dem Feld.
- Inputs, Selects und Textareas verwenden einheitliche Höhen, Radien und Fokuszustände.
- Read-only-Werte können als normale Datenzeilen dargestellt werden.

```css
.ui-field {
  display: grid;
  gap: var(--space-2);
}

.ui-field__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.ui-field__help {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.ui-field__control {
  min-height: var(--control-height);
}
```

## 11. Radio-Gruppen

Zusammengehörige Auswahlmöglichkeiten verwenden `fieldset` und `legend`.

```html
<fieldset class="ui-choice-group">
  <legend class="ui-choice-group__legend">Lebensstatus</legend>

  <label class="ui-choice">
    <input type="radio" name="life-status" value="living" />
    <span>Lebend</span>
  </label>

  <label class="ui-choice">
    <input type="radio" name="life-status" value="deceased" />
    <span>Verstorben</span>
  </label>
</fieldset>
```

Dieses Muster gilt auch für:

- Rollenwahl;
- Geschlecht;
- Lebensstatus;
- andere wenige, gegenseitig ausschließende Optionen.

Große Auswahlkacheln werden nur für wichtige Entscheidungen wie den Lebensstatus verwendet. Normale Radio-Gruppen bleiben kompakt.

## 12. Buttons

Es werden wenige, klar unterscheidbare Varianten verwendet:

- Primäraktion;
- Sekundäraktion;
- ruhige Aktion;
- destruktive Aktion;
- Icon-Button.

```html
<button class="ui-button ui-button--primary" type="button">Speichern</button>

<button class="ui-button ui-button--secondary" type="button">Abbrechen</button>

<button class="ui-icon-button" type="button" aria-label="Eintrag bearbeiten">
  <i class="bi bi-pencil" aria-hidden="true"></i>
</button>
```

Regeln:

- Normale Buttons sind nicht pillenförmig.
- Hover-Effekte verschieben Buttons nicht.
- Icon-only-Buttons besitzen immer einen zugänglichen Namen.
- Löschen verwendet die destruktive Variante.
- Pro Bereich gibt es höchstens eine klar hervorgehobene Primäraktion.

## 13. Datenzeilen und Eigenschaften

Normdaten, Metadaten und berechnete Werte werden als ruhige Label-Wert-Strukturen dargestellt.

```html
<dl class="ui-property-list">
  <div class="ui-property">
    <dt class="ui-property__label">ORCID</dt>
    <dd class="ui-property__value">
      <a href="#">0000-0002-1825-0097</a>
    </dd>
  </div>

  <div class="ui-property">
    <dt class="ui-property__label">Anzeigename</dt>
    <dd class="ui-property__value">Maria Muster</dd>
  </div>
</dl>
```

Normale Werte erhalten:

- keinen Alert;
- keinen farbigen Badge;
- keinen eigenen Kartenrahmen;
- keinen unnötigen Schatten.

Monospace wird nur für technische Identifikatoren und Rohdaten eingesetzt.

## 14. Wiederholbare Einträge

Tätigkeiten, Wirkungsorte, Quellen, Namensvarianten und weitere Lebensdaten verwenden ein gemeinsames Eintragsmuster.

```html
<article class="ui-entry">
  <header class="ui-entry__header">
    <h4 class="ui-entry__title">Kuratorin</h4>

    <div class="ui-entry__actions">
      <button
        class="ui-icon-button"
        type="button"
        aria-label="Eintrag bearbeiten"
      >
        <i class="bi bi-pencil" aria-hidden="true"></i>
      </button>

      <button
        class="ui-icon-button ui-icon-button--danger"
        type="button"
        aria-label="Eintrag löschen"
      >
        <i class="bi bi-trash" aria-hidden="true"></i>
      </button>
    </div>
  </header>

  <dl class="ui-property-list">…</dl>
</article>
```

Regeln:

- Einträge werden durch Abstand und dünne Trennlinien getrennt.
- Es gibt keine Card innerhalb einer Card.
- Aktionen stehen immer an derselben Position.
- Hinzufügen, Bearbeiten und Löschen verwenden dieselben Buttonmuster.
- Leere Listen zeigen einen einheitlichen Leerzustand.

## 15. Tätigkeiten und Wirkungsorte

Für die Demo können Tätigkeit und Wirkungsort gemeinsam dargestellt werden.

Ein Eintrag kann enthalten:

- Tätigkeit oder Funktion;
- Institution;
- Zeitraum;
- Wirkungsort;
- Beschreibung;
- Quellen.

Eine vollständige fachliche Datenmodellierung oder Migration ist nicht erforderlich. Entscheidend ist nur, dass die Demo das gemeinsame Muster verständlich zeigt.

## 16. Lebensdaten und EDTF

Lebensdaten bleiben das Referenzmuster für:

- kompakte Datenzeilen;
- wiederholbare Datumsangaben;
- Leerzustände;
- Bearbeiten- und Löschen-Aktionen;
- Dialoge;
- responsive Unterabschnitte.

Der EDTF-Rohwert darf Monospace verwenden. Die sprachliche Interpretation wird als normaler Text dargestellt.

Geburt und Tod können auf ausreichend breiten Ansichten nebeneinander stehen. Auf kleineren Ansichten bleiben sie untereinander.

## 17. Hinweise und Statusmeldungen

Hinweise werden nur eingesetzt, wenn tatsächlich eine Information, Warnung oder Fehlermeldung vorliegt.

```html
<div class="ui-notice ui-notice--info">
  Diese Rollenwahl dient nur zur Demonstration.
</div>
```

Varianten:

- Information;
- Erfolg;
- Warnung;
- Fehler.

Normale Datenwerte und berechnete Anzeigenamen sind keine Hinweise.

Badges beziehungsweise Chips werden nur für echte Statusangaben verwendet, beispielsweise:

- aktiv;
- in Prüfung;
- gelöscht;
- nicht veröffentlicht.

## 18. Leerzustände

Alle wiederholbaren Listen verwenden einen vergleichbaren Leerzustand.

```html
<div class="ui-empty-state">
  <p>Noch keine Namensvariante vorhanden.</p>
  <button class="ui-button ui-button--secondary" type="button">
    Namensvariante hinzufügen
  </button>
</div>
```

Texte sollen eindeutig unterscheiden zwischen:

- nicht vorhanden;
- unbekannt;
- nicht anwendbar;
- nicht freigegeben.

Für die Demo genügt eine einfache textliche Unterscheidung.

## 19. Dialoge

Bestehende Bootstrap-Modale dürfen beibehalten werden.

Alle Dialoge verwenden möglichst dieselbe Struktur:

- klarer Titel;
- Schließen-Button;
- Formularinhalt;
- Abbrechen;
- Übernehmen oder Speichern;
- Löschen getrennt und deutlich markiert.

Die Beschriftungen sollen einheitlich deutsch sein.

EDTF-Dialoge und andere bestehende Interaktionen müssen nicht technisch neu implementiert werden. Sie sollen nur visuell an das übrige Design angepasst werden.

## 20. Navigation und Demo-Steuerung

Die Seitennavigation bleibt als kompakte Abschnittsnavigation erhalten.

Sie zeigt:

- einen klaren aktiven Abschnitt;
- keine einzelnen Cards pro Navigationseintrag;
- nur sichtbare beziehungsweise relevante Abschnitte.

Rollenwahl, Theme-Umschaltung und andere Demo-Funktionen werden als eigene Demo-Werkzeugleiste dargestellt und nicht als fachlicher Formularabschnitt.

## 21. Fokus und Bedienbarkeit

Für alle interaktiven Elemente gilt ein einheitlicher Fokuszustand.

```css
:where(a, button, input, select, textarea, summary):focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

Für die Demo gelten folgende Mindestregeln:

- alle sichtbaren Controls sind per Tastatur erreichbar;
- Icon-Buttons besitzen verständliche Namen;
- Labels sind mit Inputs verbunden;
- Dialoge lassen sich schließen;
- Fokus ist sichtbar;
- Text und Controls haben ausreichenden Kontrast;
- verborgene Bereiche sind nicht fokussierbar.

Eine vollständige formale Accessibility-Zertifizierung ist nicht Bestandteil.

## 22. Responsive Verhalten

Mindestens sinnvoll zu prüfen sind:

- etwa 375px;
- 768px;
- 1024px;
- 1440px.

Dabei gilt:

- kein horizontaler Seitenüberlauf;
- Buttons und Texte dürfen sich nicht überlagern;
- lange Namen und IDs dürfen umbrechen;
- zweispaltige Gruppen werden bei Platzmangel einspaltig;
- die Sidebar darf den Formularinhalt nicht zu stark verengen;
- Dialoge müssen innerhalb des Viewports bleiben.

## 23. Namenskonventionen

Neue neutrale Komponenten verwenden das Präfix `ui-`.

Beispiele:

```css
.ui-section
.ui-subsection
.ui-field
.ui-button
.ui-icon-button
.ui-property-list
.ui-entry
.ui-empty-state
.ui-notice
.ui-chip
```

Fachliche Klassen können zusätzlich bestehen bleiben, beispielsweise:

```css
.person-life-data
.authority-record
.source-entry
.audit-history
```

JavaScript-Hooks werden nach Möglichkeit über `data-*`-Attribute definiert:

```html
<button data-action="add-name-variant">Namensvariante hinzufügen</button>
```

Bootstrap- und neue Klassen dürfen während der Demo-Migration parallel verwendet werden.

## 24. Nicht verwenden

Für neue Komponenten sollen folgende Muster vermieden werden:

- verschachtelte Cards;
- Alerts für normale Datenwerte;
- Badge pro Metadatenwert;
- weiße Schrift auf hellen Pastellflächen;
- Pillenform für normale Buttons;
- dekorative Schatten;
- Hover-Bewegungen;
- mehrere Akzentfarben pro Abschnitt;
- Icons ohne erkennbare Funktion;
- Icon-only-Buttons ohne zugänglichen Namen;
- Platzhalter als einziges Label;
- neue Framework- oder Build-Abhängigkeiten;
- technische Einbindung von shadcn/ui oder Tailwind.

## 25. Priorisierte Komponenten

Für die Demo werden zunächst nur folgende Komponenten verbindlich vereinheitlicht:

1. Hauptabschnitt
2. Unterabschnitt
3. klassisches Eingabefeld
4. Radio-Gruppe
5. Button und Icon-Button
6. Datenzeile beziehungsweise Property List
7. wiederholbarer Eintrag
8. Leerzustand
9. Hinweis
10. Dialog

Weitere Komponenten werden nur ergänzt, wenn sie in der Demo tatsächlich benötigt werden.

## 26. Übertragung auf die Formularbereiche

Die Komponenten werden in dieser Reihenfolge angewendet:

### Lebensdaten

Referenz für:

- Unterabschnitte;
- Datenzeilen;
- EDTF;
- wiederholbare Einträge;
- Leerzustände.

### Identität

Referenz für:

- klassische Eingabefelder;
- Radio-Gruppen;
- Titel;
- Namensvarianten;
- dynamische Kurzzeilen.

### Anzeigename und Normdaten

Referenz für:

- berechnete Werte;
- Label-Wert-Strukturen;
- externe Identifikatoren;
- aufklappbare Zusatzbereiche.

### Tätigkeiten und Wirkungsorte

Referenz für:

- größere wiederholbare Einträge;
- Zeiträume;
- Beziehungen;
- Institutionen und Orte.

### Quellen und Kommentare

Referenz für:

- redaktionelle Inhalte;
- Metadaten;
- Aktionen;
- flache Thread- und Listenstrukturen.

### Administrative Bereiche

Referenz für:

- Tabellen;
- Importdaten;
- JSON;
- globale Aktionen.

## 27. Ausreichende Abnahme für die Demo

Das Designsystem gilt als ausreichend umgesetzt, wenn:

- die Hauptabschnitte visuell einheitlich sind;
- Lebensdaten und klassische Formularfelder dieselben Grundregeln verwenden;
- Radio-Gruppen, Titel und Namensvarianten konsistent funktionieren;
- Buttons und Icon-Buttons einheitlich aussehen;
- wiederholbare Einträge dieselbe Grundanatomie besitzen;
- verschachtelte Cards deutlich reduziert sind;
- normale Werte nicht als Alerts dargestellt werden;
- die Demo auf Desktop und mobilen Breiten sinnvoll funktioniert;
- die bestehenden EDTF-, Rollen- und Demo-Interaktionen weiterhin nachvollziehbar sind;
- die Anwendung ohne Buildprozess als statische HTML-Seite ausführbar bleibt.

## 28. Nicht Bestandteil

Für diese Demo sind nicht erforderlich:

- vollständige Komponentenbibliothek;
- vollständige Code- und CSS-Inventur;
- formale Migrationsmatrix;
- produktive serverseitige Berechtigungsarchitektur;
- vollständige Datenmigration;
- vollständige WCAG- oder Browserzertifizierung;
- vollständiger Offlinebetrieb;
- vollständige Bootstrap-Ablösung;
- eigenständige Referenzseite für jede Komponentenvariante;
- ausführliche Risiko- und Aufwandstabellen;
- formale Freigaben nach jeder Designänderung.

## 29. Wichtigste Entscheidungen

1. Die Demo bleibt statisches HTML, CSS und Vanilla JavaScript.
2. Bootstrap darf weiterverwendet werden.
3. Es wird kein neues Framework eingeführt.
4. Lebensdaten bilden das erste neutrale Referenzmuster.
5. Die Regeln werden anschließend auf klassische Eingabefelder, Radio-Gruppen, Titel und Namensvarianten übertragen.
6. Hauptabschnitte besitzen einen äußeren Container; innere Inhalte bleiben möglichst flach.
7. Wiederholbare Datensätze verwenden ein gemeinsames Eintragsmuster.
8. Typografie, Abstand und Trennlinien sind wichtiger als Karten, Farben und Schatten.
9. Accessibility wird pragmatisch berücksichtigt, aber nicht vollständig zertifiziert.
10. Ziel ist eine überzeugende Demo, keine produktionsfertige Anwendung.
