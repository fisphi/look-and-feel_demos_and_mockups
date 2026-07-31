# Regressionstest-Checkliste – Personenformular

## Baseline

| Merkmal | Wert |
| --- | --- |
| Getesteter Commit | `22bc90c` (`test(person-form): add phase zero regression checklist`) |
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

- **Bestanden**: Alle dokumentierten Schritte wurden ausgeführt; jedes erwartete Ergebnis wurde erreicht.
- **Fehlgeschlagen**: Alle erforderlichen Schritte wurden ausgeführt; mindestens ein erwartetes Ergebnis wurde nicht erreicht.
- **Teilweise getestet**: Nur ein Teil der Schritte, eine Quellcodeprüfung, ein Parser- oder ein einzelner Browseraspekt wurde geprüft.
- **Blockiert**: wegen externer Voraussetzung nicht ausführbar.
- **Nicht getestet**: in diesem Lauf noch offen; vor einer betroffenen Migration
  nachholen.

## Kompakte Abdeckungsmatrix

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Umgebung und Ausgangszustand | 3 | 2 | 0 | 0 | 0 | 1 |
| Rollen und Viewer | 11 | 0 | 0 | 10 | 0 | 1 |
| Rollen- und Lebensstatuswechsel | 5 | 0 | 0 | 2 | 0 | 3 |
| EDTF | 10 | 0 | 1 | 7 | 0 | 2 |
| Dynamische Listen | 8 | 0 | 0 | 2 | 0 | 6 |
| Validierung | 8 | 0 | 0 | 5 | 0 | 3 |
| Export und Reset | 7 | 0 | 1 | 4 | 0 | 2 |
| Theme und Darstellung | 5 | 1 | 0 | 1 | 0 | 3 |
| Tastatur und Fokus | 8 | 0 | 0 | 3 | 0 | 5 |
| Responsive und Abhängigkeiten | 7 | 2 | 1 | 2 | 0 | 2 |
| Phase-1-Befunde | 8 | 0 | 4 | 3 | 0 | 1 |
| **Gesamt** | **80** | **5** | **7** | **39** | **0** | **29** |

### Nachweis- und Umgebungsregister

Alle Fälle verwenden die oben beschriebene lokale HTTP-Umgebung. Die Einträge
im Feld „Tatsächliches Ergebnis“ sind zugleich der konkrete Nachweis:

- **Chromium-Smoke 31.07.2026:** Headless Chromium gegen `http://127.0.0.1:8765`; Rollen-, Viewer-, EDTF-, Listen-, Theme- und Reset-Abläufe.
- **Chromium-Audit 31.07.2026:** zusätzliche 12 Rollen-/Lebensstatuskombinationen, Alert-Klasse, ORCID-Ausgabe, dynamischer Papierkorb und Reset-Zustand.
- **Quellcodeprüfung 31.07.2026:** Fundstellen in `index.html`, `form.js`, `validation.js`, `styles.css` und `edtf-component.js`.
- **Parserprüfung 31.07.2026:** `window.EDTFForm.parseLevelOne()` in Chromium.
- **Kontrastberechnung 31.07.2026:** WCAG-Relativluminanzformel über die im Stylesheet definierten, opaken Hexfarben.

Ist ein Ablauf nur mit „Quellcodeprüfung“, „Parserprüfung“ oder einem
Teil-Smoketest belegt, ist sein Status zwingend **Teilweise getestet**. Nicht
ausgeführte Schritte stehen explizit im Feld „Tatsächliches Ergebnis“.

### Verbindliche Feldzuordnung je Bestandsfall

Die Tabellenfälle sind kompakt dokumentiert; dabei gelten für **jede** Zeile
folgende, eindeutige Zuordnungen. Damit sind Soll, beobachteter Ist-Zustand und
noch offene Teile getrennt, ohne die Checkliste mit wiederholten Metadaten zu
überladen:

- **Prüfbereich** ist die jeweilige Überschrift der Tabelle; **Zweck** ist die
  durch ID, Schritte und „Erwartetes Ergebnis“ konkret beschriebene fachliche
  oder technische Eigenschaft.
- **Testdaten** sind die „Ausgangsdaten“ oben; zusätzliche Werte (etwa
  EDTF-Werte, Viewportbreiten oder Rollen) stehen jeweils explizit in
  Vorbedingung oder Schritten. Fehlt ein abweichender Wert, gelten die
  Ausgangsdaten unverändert.
- **Testmethode, Testumgebung und Nachweis** stehen bei bewerteten Fällen
  ausdrücklich am Anfang von „Tatsächliches Ergebnis“; die lokale HTTP- und
  Chromium-Umgebung ist im Nachweisregister festgelegt. Bei nicht ausgeführten
  Fällen ist der Nachweis bewusst leer und das Feld beschreibt den offenen
  Ablauf.
- **Bekannte Einschränkungen/nicht ausgeführter Teil** stehen ebenfalls im
  Feld „Tatsächliches Ergebnis“ (zum Beispiel „… offen“). Ein Fall ohne
  Durchführung bleibt deshalb **Nicht getestet**, auch wenn seine Schritte
  aus Planungs- oder Quellcodegründen bekannt sind.

## Testfälle

### Umgebung und Ausgangszustand

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| ENV-01 | Lokaler HTTP-Server läuft. | 1. Seite laden. 2. Konsole prüfen. 3. `window.EDTFForm` prüfen. | Bootstrap und EDTF-Komponente laden; keine Anwendungsausnahme. | **Methode/Nachweis:** Chromium-Smoke in der lokalen HTTP-Umgebung. `window.EDTFForm` vorhanden, keine `window.error`-Meldung. | Bestanden |
| ENV-02 | Frische Seite. | 1. Rollenradio prüfen. 2. Lebensstatus und Beispieldaten prüfen. | DB-Owner und „verstorben“ sind ausgewählt; Demo-Daten sind sichtbar. | **Methode/Nachweis:** Quellcode- und Chromium-Smoke-Prüfung. DB-Owner, „verstorben“ und die Demo-Daten waren vorhanden. | Bestanden |
| ENV-03 | Netzwerk gezielt blockierbar. | 1. jsDelivr für EDTF blockieren. 2. Seite laden. | EDTF-Hosts zeigen die dokumentierte Fehlermeldung; übrige Abhängigkeiten und Ausfallwirkung werden protokolliert. | Noch nicht mit Netzwerkblockade ausgeführt. | Nicht getestet |

### Rollen

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| ROLE-01 | Neu geladen, DB-Owner. | 1. Sichtbare Abschnittslinks zählen. 2. Bearbeitungs- und Sidebar-Aktionen prüfen. 3. Export und Reset auslösen, Dialog/Download ggf. abbrechen. | Alle 13 Abschnitte und Aktionen sind verfügbar. | **Methode/Nachweis:** Chromium-Smoke. Alle 13 Abschnitte sowie Export/Reset waren sichtbar. Ausführung von Download und Reset war nicht Teil dieses Falls; siehe DATA-01/DATA-06. | Teilweise getestet |
| ROLE-02 | Neu geladen. | 1. Record-Owner wählen. 2. Lebensstatus, Identität, Export und Reset prüfen. 3. Zu DB-Owner zurückwechseln. | Soll gemäß sichtbarer Rollenbeschreibung: alle Abschnitte sichtbar; `lebensstatus` und `identitaet` schreibgeschützt; Export und Reset sichtbar. Der bestehende Ist-Zustand kann diesem Soll widersprechen. | **Methode/Nachweis:** Chromium-Smoke/Audit. Alle Abschnitte, Export und Reset waren sichtbar; die beiden genannten Bereiche waren nicht deaktiviert. Validierungs- und Aktionsfolgen wurden nicht vollständig ausgeführt. | Teilweise getestet |
| ROLE-03 | Neu geladen. | 1. Record-Editor wählen. 2. Lebensstatus, Identität und Kontakt bedienen. 3. Übrige Abschnitte bedienen. | Lebensstatus, Identität und Kontakt sind deaktiviert; übrige Bereiche verfügbar. | **Methode/Nachweis:** Chromium-Smoke. Genau diese drei Abschnitte hatten `disabled-section`; direkte Bearbeitungsversuche und Exportfolge offen. | Teilweise getestet |
| ROLE-04 | Neu geladen. | 1. Record-Viewer wählen. 2. Sidebar, globale Aktionen und Abschnittslinks prüfen. 3. Vorherige Rolle wiederherstellen. | Nur freigegebene Viewer-Bereiche; Reset und Export verborgen/deaktiviert; keine veralteten Controls. | **Methode/Nachweis:** Chromium-Smoke. Reset/Export verborgen; Rückwechsel Owner geprüft. Vollständiger Sidebar-/Tabulatorlauf offen. | Teilweise getestet |
| ROLE-05 | Jede Rolle nacheinander gewählt. | 1. Nach jedem Wechsel Tabulator drücken. 2. Deaktivierte/verborgene Bereiche prüfen. | Verborgene Controls sind nicht fokussierbar; disabled Controls können nicht schreiben. | Nur Viewer- und EDTF-Aktionen automatisiert geprüft. Vollständiger Tab-Lauf offen. | Nicht getestet |

### Record-Viewer

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| VIEW-01 | Lebensstatus „verstorben“. | 1. Record-Viewer wählen. 2. Sichtbare Hauptabschnitte und Navigation notieren. | Nur Rollenwahl, Anzeigename und vorhandene Anmerkungen/Kommentare sichtbar. | **Methode/Nachweis:** Chromium-Smoke. Sichtbar: `userrolle`, `anzeigename`, `meta`; Kommentar-Trigger verborgen. Navigation nicht vollständig einzeln geprüft. | Teilweise getestet |
| VIEW-02 | Lebensstatus „lebend“. | 1. Record-Viewer wählen. 2. Identität und Quellen öffnen. 3. Sichtbare Identitätsfelder notieren. | Zusätzlich Vorname, Nachname und Quellen; sonst keine zusätzlichen Personendaten. | **Methode/Nachweis:** Chromium-Smoke. `identitaet`/`quellenangaben` sichtbar; in Identität nur `vorname`, `nachname`. Einzelne Quellwerte nicht manuell geprüft. | Teilweise getestet |
| VIEW-03 | Viewer, beide Lebensstatus getrennt. | 1. Kommentar-/Notiz-/Quellen-Trigger prüfen. 2. Tastaturaktivierung versuchen. 3. Modale im DOM prüfen. | Keine Schreibaktion erreichbar; relevante Modale sind inert. | **Methode/Nachweis:** Chromium-Smoke. Kommentar-Trigger verborgen, Meta-Controls nicht aktiviert. Tastaturaktivierung und Modal-`inert` nicht vollständig geprüft. | Teilweise getestet |
| VIEW-04 | Viewer. | 1. Record History, Import und technische Metadaten über UI und Sidebar suchen. 2. Export/Reset/Speichern auslösen. | Bereiche und Aktionen nicht sichtbar bzw. nicht ausführbar. | **Methode/Nachweis:** Chromium-Smoke. History/Import verborgen, Export/Reset verborgen. Speichern und erzwungene Aktionen nicht geprüft. | Teilweise getestet |
| VIEW-05 | Viewer mit absichtlich leerem Nachnamen oder anderen Pflichtwerten. | 1. Export/Save-ähnliche Aktion anstoßen. 2. `validateForm()` in Konsole prüfen. | Keine Pflichtprüfung verborgener oder nicht bearbeitbarer Felder. | **Methode/Nachweis:** Quellcodeprüfung: `validateForm()` gibt für `user` unmittelbar `true` zurück. Kein kompletter UI-Aktionslauf. | Teilweise getestet |
| VIEW-06 | Viewer. | 1. DevTools öffnen. 2. Verborgene DOM-Elemente und `collectPersonFormData` untersuchen. | Baseline dokumentiert, dass dies keine Zugriffskontrolle ist. | **Methode/Nachweis:** Quellcodeprüfung. **Sicherheitsbefund:** Sperren sind ausschließlich clientseitig; DOM und JavaScript bleiben lokal zugänglich. Produktion muss Abruf, Speicherung und Export serverseitig autorisieren. | Teilweise getestet |

### Rollen- und Lebensstatuswechsel

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| STATE-01 | DB-Owner, verstorben mit Sterbedatum. | 1. „lebend“ wählen. 2. Bestätigungsdialog einmal abbrechen, einmal bestätigen. | Abbruch stellt Status wieder her; Bestätigung löscht Sterbedatum bewusst und deaktiviert Todesfelder. | Funktion im Quellpfad dokumentiert; vollständiger Dialoglauf offen. | Nicht getestet |
| STATE-02 | DB-Owner, lebend. | 1. „verstorben“ wählen. 2. Sterbedatum und Sterbeort bedienen. | Todesfelder werden wieder verfügbar. | Durch `syncDeathAvailability` und Lebensstatus-Gate vorhanden; manuell offen. | Nicht getestet |
| STATE-03 | Viewer, verstorben. | 1. Auf lebend wechseln. 2. Sichtbarkeit prüfen. 3. Wieder verstorben wählen. | Identität/Quellen erscheinen nur bei lebend und verschwinden wieder vollständig. | **Methode:** Chromium-Smoke. **Nachweis:** Sichtbarkeit für Viewer bei „verstorben“ und „lebend“ dokumentiert. **Geprüft:** Erscheinen von Identität/Quellen bei „lebend“. **Offen:** Rückwechsel zu „verstorben“ und vollständiges Verschwinden. **Voraussetzung für Vollprüfung:** reproduzierbarer UI-Lauf beider Wechsel im Viewer. | Teilweise getestet |
| STATE-04 | Alle vier Rollen. | 1. Jede Kombination aus Rolle und Lebensstatus wechseln. 2. Mehrfach hin- und herwechseln. | Keine alten Sichtbarkeits-, Disabled- oder Aktionszustände. | **Methode/Nachweis:** Chromium-Audit durchlief alle 12 Rolle-/Statuskombinationen. Mehrfaches Hin- und Herwechseln derselben Kombination sowie alle Aktionszustände nicht vollständig geprüft. | Teilweise getestet |
| STATE-05 | Record-Editor. | 1. Lebensstatus wählen. 2. Wechsel zu Owner und zurück. | Rollenrestriktionen bleiben nach Statuswechsel wirksam. | Noch nicht als Kombination geprüft. | Nicht getestet |

### EDTF

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| EDTF-01 | DB-Owner. | 1. Geburtsdatum bearbeiten. 2. Vollständiges Datum `2000-02-29` eingeben. 3. Übernehmen. | Kanonischer Wert und deutsche Interpretation erscheinen. | **Methode:** Parser-Smoke. **Nachweis:** `2000-02-29` wurde als gültig geparst. **Geprüft:** Parserakzeptanz des Schaltjahresdatums. **Offen:** Eingabe, Übernahme und kompakte Anzeige im Modal/UI. **Voraussetzung für Vollprüfung:** interaktiver Modal-Lauf als DB-Owner. | Teilweise getestet |
| EDTF-02 | DB-Owner. | 1. Je `1874`, `1874-03`, `1874-03-12` über die Maske setzen. 2. Anzeige prüfen. | Jahr, Monat und Datum sind gültig und lesbar interpretiert. | **Methode/Nachweis:** Parserprüfung: alle drei gültig. Maskeneingabe und Anzeige nicht ausgeführt. | Teilweise getestet |
| EDTF-03 | DB-Owner. | 1. `1874-03-XX`, `187X`, `18XX` setzen. 2. Anzeige prüfen. | Unbekannte Teile sind gültig; Rohwert und Interpretation stimmen. | **Methode/Nachweis:** Parserprüfung: alle drei gültig. Masken- und Anzeigeprüfung offen. | Teilweise getestet |
| EDTF-04 | DB-Owner. | 1. `1874?`, `1874~`, `1874%` setzen. 2. Interpretation prüfen. | Unsicher, ungefähr und kombiniert werden unterstützt. | **Methode/Nachweis:** Parserprüfung: alle drei gültig. Interpretation im Modal/Compact View nicht geprüft. | Teilweise getestet |
| EDTF-05 | Zeitraum. | 1. `1901/1918`, `1995/..`, `1995/`, `/1918` erzeugen. 2. Endzustandsmodal prüfen. | Geschlossene und offene Intervalle bleiben kanonisch und verständlich. | **Methode/Nachweis:** Parserprüfung: alle vier gültig. UI-Endzustände nicht ausgeführt. | Teilweise getestet |
| EDTF-06 | DB-Owner. | 1. `1900-02-29` und `2026-13` eingeben. 2. Übernehmen versuchen. | Fehlermeldung; Modal bleibt offen; kein ungültiger Wert wird gespeichert. | **Methode/Nachweis:** Parserprüfung: beide ungültig. Das verlangte Modalverhalten wurde nicht ausgeführt. | Teilweise getestet |
| EDTF-07 | Geburt und Tod vorhanden. | 1. Tod vollständig vor Geburt setzen. 2. Validierung auslösen. | Chronologiefehler am Sterbedatum. | Noch nicht interaktiv geprüft. | Nicht getestet |
| EDTF-08 | Weitere Lebensdaten leer. | 1. Datum hinzufügen. 2. `1874` setzen. 3. Zweites Datum hinzufügen. 4. Erstes bearbeiten und eines entfernen. | 0/1/n, Edit, Cancel und Delete sind unabhängig; Fokus kehrt sinnvoll zurück. | **Methode/Nachweis:** Chromium-Smoke: Hinzufügen und kanonische Übernahme von `1874`. Zweiter Eintrag, Edit, Cancel, Delete und Fokusfolge offen. | Teilweise getestet |
| EDTF-09 | Viewer mit EDTF-Werten. | 1. Viewer wählen. 2. Hinzufügen- und Stift-Aktionen prüfen. | Keine EDTF-Schreibaktionen sichtbar oder aktiv. | Über zentrale Rollenaktion im bisherigen Browsertest bestätigt; in diesem Lauf nicht erneut ausgeführt. | Nicht getestet |
| EDTF-10 | Nach EDTF-Änderungen. | 1. Reset auslösen. 2. Rollen wechseln. | Definierter Resetzustand ohne doppelte Listener oder Datenreste. | **Methode/Nachweis:** Chromium-Audit, siehe DATA-06/P1-RESET-01. Reset ließ Rolle und Lebensstatus leer; der anschließende Rollenwechsel-/Listenerteil wurde nicht ausgeführt. | Fehlgeschlagen |

### Dynamische Listen

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| LIST-01 | Weitere Lebensdaten leer. | 1. Leertext prüfen. 2. Hinzufügen drücken. 3. Abbrechen. | Leertext bleibt rein visuell; keine Daten werden exportiert. | **Methode:** Chromium-Smoke. **Nachweis:** Der dokumentierte Add/Save-Pfad exportierte einen kanonischen Wert. **Geprüft:** Hinzufügen und Speichern. **Offen:** Leertext vor dem Hinzufügen und Abbruchverhalten. **Voraussetzung für Vollprüfung:** UI-Lauf mit leerer Liste, Abbruch und anschließender Exportprüfung. | Teilweise getestet |
| LIST-02 | Tätigkeiten. | 1. Tätigkeit hinzufügen. 2. Zwei Rollen ergänzen. 3. Einzelne Rolle und Tätigkeit entfernen. | Reihenfolge, verbleibende Einträge und EDTF-Initialisierung stimmen. | Nicht getestet |
| LIST-03 | Wirkungsorte. | 1. Ort hinzufügen. 2. Autocomplete wählen. 3. Zeitraum setzen. 4. Entfernen. | Dynamischer Ort erhält Autocomplete, EDTF und zugängliche Aktionen. | Nicht getestet |
| LIST-04 | Quellen. | 1. Quelle über Modal anlegen. 2. Typ wechseln. 3. Abbrechen, speichern und entfernen. | Richtige Felder, keine Reste nach Abbruch. | Nicht getestet |
| LIST-05 | Anmerkungen/Kommentare. | 1. Kommentar und Antwort öffnen. 2. Abbrechen und speichern. 3. Viewer wechseln. | Thread, Aktionen, Rollenblockade und Fokus bleiben konsistent. | Nicht getestet |
| LIST-06 | Namensvarianten. | 1. Mehrere Varianten ergänzen. 2. Entfernen. 3. Tastaturnamen der Papierkorb-Buttons prüfen. | Dynamische Buttons haben verständliche Namen; keine Reihenfolgenfehler. | **Methode/Nachweis:** Quellcodeprüfung und Chromium-Audit eines dynamisch erzeugten Rollen-Papierkorbs: kein `aria-label`, kein Titel, kein Text; `tabIndex=0`. Mehrere Namensvarianten und Entfernen nicht ausgeführt. | Teilweise getestet |
| LIST-07 | Jede dynamische Liste. | 1. Hinzufügen. 2. Fokusposition notieren. 3. Entfernen. 4. Nächsten logischen Fokus prüfen. | Fokus bleibt sichtbar und sinnvoll. | Nicht getestet |
| LIST-08 | Dynamische Einträge vorhanden. | 1. Viewer wählen. 2. Danach Owner wählen. | Einträge bleiben korrekt, Schreibaktionen folgen Rolle. | Nicht getestet |

### Validierung

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| VAL-01 | DB-Owner, leeres Formular. | 1. Reset bestätigen. 2. Export auslösen. | Lebensstatus und Nachname werden als erforderlich gemeldet. | **Methode:** Quellcodeprüfung. **Nachweis:** Prüfungen für Lebensstatus und Nachname sind vorhanden; RESET-01 beachten. **Geprüft:** Existenz der beiden Validierungsregeln. **Offen:** Reset, Exportauslösung und sichtbare Fehlermeldungen. **Voraussetzung für Vollprüfung:** interaktiver Exportlauf mit definiertem leeren Ausgangszustand. | Teilweise getestet |
| VAL-02 | DB-Owner, gültige Demo-Daten. | 1. Export auslösen. | Keine Validierungsfehler; Download wird erstellt. | **Methode:** Chromium-Smoke. **Nachweis:** Serialisierung wurde ausgeführt. **Geprüft:** Serialisierung mit gültigen Demo-Daten. **Offen:** Exportauslösung, Download und sichtbare Validierungsfreiheit. **Voraussetzung für Vollprüfung:** Browserlauf mit beobachtbarem Download. | Teilweise getestet |
| VAL-03 | DB-Owner. | 1. Jede `data-validate`-Regel mit ungültigem Wert prüfen. 2. Korrigieren. | Feldnahe Fehlermeldung verschwindet nach Korrektur. | Nicht getestet |
| VAL-04 | DB-Owner. | 1. Ungültiges EDTF und ungültiges Intervall setzen. 2. Speichern/Export versuchen. | Live-Region und/oder Feldfehler; keine Übernahme. | **Methode:** Parserprüfung aus EDTF-06. **Nachweis:** Ungültige EDTF-Werte wurden abgewiesen. **Geprüft:** Parserablehnung der ungültigen Datumswerte. **Offen:** ungültiges Intervall, Live-Region/Feldfehler sowie Speichern/Export. **Voraussetzung für Vollprüfung:** interaktiver Validierungs- und Exportlauf. | Teilweise getestet |
| VAL-05 | Dynamische Pflichtfelder. | 1. Dynamischen Eintrag mit leerem Pflichtwert erzeugen. 2. Validieren. | Fehler am dynamischen Feld, keine falsche Prüfung anderer Felder. | Nicht getestet |
| VAL-06 | Viewer mit leeren Pflichtfeldern. | 1. `validateForm()` ausführen. | Rückgabe `true`; keine Fehler auf verborgenen Feldern. | **Methode/Nachweis:** Quellcodeprüfung des Viewer-Guards. Konsole und UI-Exportablauf mit absichtlich leeren Werten offen. | Teilweise getestet |
| VAL-07 | Fehlende Pflichtwerte. | 1. Export auslösen. 2. Fokus und Scrollposition beobachten. | Fokus bzw. Navigation zum ersten Fehler ist dokumentiert. | **Methode/Nachweis:** Quellcodeprüfung: kein Error-Summary/Fokusmanagement. Export- und Fokuslauf nicht ausgeführt. | Teilweise getestet |
| VAL-08 | Record-Editor. | 1. Deaktivierte Pflichtfelder leer lassen. 2. Export prüfen. | Nur aktive und relevante Felder werden validiert. | Nicht getestet |

### JSON-Export und Reset

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| DATA-01 | DB-Owner, Ausgangsdaten. | 1. Export klicken. 2. Download öffnen. | JSON enthält statische Ausgangsfelder. | **Methode:** Chromium-Smoke. **Nachweis:** `collectPersonFormData()` war ausführbar. **Geprüft:** Datensammlung vor dem Export. **Offen:** Klick auf Export, Download und dessen Inhalt. **Voraussetzung für Vollprüfung:** Browserlauf mit zugänglicher Downloaddatei. | Teilweise getestet |
| DATA-02 | DB-Owner. | 1. Feld, EDTF und dynamischen Eintrag ändern. 2. Export öffnen. | Kanonische EDTF-Werte und Arrays vorhanden. | **Methode/Nachweis:** Chromium-Smoke: `collectPersonFormData()` enthielt `datum_ohne_kontext: ["1874"]`. Downloaddatei wurde nicht geöffnet. | Teilweise getestet |
| DATA-03 | Viewer. | 1. Export-/Reset-Button und Tastatur prüfen. 2. Klick erzwingen. | Aktionen sind verborgen/deaktiviert und führen nichts aus. | **Methode/Nachweis:** Chromium-Smoke: beide Buttons verborgen; Quellcode blockiert Viewer im Handler. Erzwungener Klick und Tastatur nicht ausgeführt. | Teilweise getestet |
| DATA-04 | DB-Owner. | 1. Quelle, Tätigkeit, Wirkungsort und Liste ändern. 2. Export vergleichen. | Alle dynamischen Werte werden einmal, geordnet und ohne UI-Hilfswerte exportiert. | Nicht getestet |
| DATA-05 | DB-Owner. | 1. Theme wechseln. 2. Neu laden. 3. Reset auslösen. | Theme-Persistenz und Resetverhalten werden separat erfasst. | **Methode:** Chromium-Smoke. **Nachweis:** Der Theme-Wechsel wurde ausgelöst. **Geprüft:** Umschalten des Themes. **Offen:** Persistenz nach Neuladen und Resetverhalten. **Voraussetzung für Vollprüfung:** Browserlauf mit Reload und bestätigtem Reset. | Teilweise getestet |
| DATA-06 | DB-Owner. | 1. Rolle, Status und dynamisches Datum ändern. 2. Reset bestätigen. 3. Gewählte Rolle, Status, Daten und Listener prüfen. | Definierter Ausgangszustand wird vollständig wiederhergestellt. | **Methode/Nachweis:** Chromium-Audit und Quellcodeprüfung von `attachResetButton()`. Alle Radios werden geleert und keine Rolle erneut gesetzt; im Smoke war danach keine Rolle ausgewählt. Mehrfach-Listener sind noch offen. | Fehlgeschlagen |
| DATA-07 | Nach DATA-06. | 1. Mehrfach Reset ausführen. 2. Dynamischen Eintrag hinzufügen. | Keine doppelten Handler, keine Datenreste. | Nicht getestet |

### Hell- und Dunkelmodus

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| THEME-01 | Seite geladen. | 1. Theme-Button betätigen. 2. `data-bs-theme` prüfen. | Modus wechselt zwischen hell/dunkel. | **Methode/Nachweis:** Chromium-Smoke. Der Theme-Button änderte `data-bs-theme` zwischen hell und dunkel. | Bestanden |
| THEME-02 | Beide Modi. | 1. Formfelder, disabled/read-only, Fehler, Lebensstatus, Modale und Leerzustände prüfen. | Text und Zustände ausreichend lesbar; konkrete Probleme dokumentieren. | Nicht getestet |
| THEME-03 | Dunkelmodus. | 1. Neu laden. 2. `localStorage.theme` und Icon prüfen. | Gewählter Modus bleibt erhalten; Icon entspricht Gegenaktion. | Nicht getestet |
| THEME-04 | Beide Modi. | 1. Fokus mit Tastatur auf Button, Input, Link und Modal schließen. | Sichtbarer Fokus mit ausreichendem Kontrast. | **Methode/Nachweis:** Quellcode-/Inventurprüfung: kein globaler `:focus-visible`-Standard. Sichtbarer Fokus und Kontrast nicht browserseitig geprüft. | Teilweise getestet |
| THEME-05 | Forced Colors und Reduced Motion verfügbar. | 1. DevTools-Emulation aktivieren. 2. Kernaktionen prüfen. | Keine unlesbaren Zustände oder unkontrollierte Bewegung. | Nicht getestet |

### Tastatur und Fokus

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| KEY-01 | DB-Owner. | 1. Ab Seitenanfang nur mit Tab/Shift+Tab navigieren. 2. Reihenfolge notieren. | DOM- und Leserichtung stimmen; keine versteckten Ziele. | Nicht getestet |
| KEY-02 | Rollen- und Statusradios. | 1. Mit Pfeiltasten wählen. 2. Wirkung prüfen. | Auswahl und Gates aktualisieren sich. | Nicht getestet |
| KEY-03 | EDTF-Aktion. | 1. Per Tab fokussieren. 2. Enter drücken. 3. Modal bedienen. 4. Escape. | Modal öffnet, Fokus liegt sinnvoll, Escape speichert nicht und Fokus kehrt zurück. | **Methode:** Quellcodeprüfung. **Nachweis:** EDTF-Modal- und Fokuslogik sind vorhanden. **Geprüft:** Implementierter Steuerungspfad. **Offen:** vollständiger Tastaturdurchlauf, Escape ohne Speichern und Fokusrückkehr. **Voraussetzung für Vollprüfung:** manueller Tastaturlauf in Chromium mit geöffneter EDTF-Maske. | Teilweise getestet |
| KEY-04 | EDTF-Hilfe. | 1. Hilfeicon fokussieren. 2. Enter, Escape und Rückkehr prüfen. | Name/Tooltip, Dialogtitel und Fokus stimmen. | Nicht getestet |
| KEY-05 | Dynamische Liste. | 1. Hinzufügen per Enter. 2. Abbrechen. 3. Entfernen. | Keine Tastaturfalle; Fokus bleibt sinnvoll. | Nicht getestet |
| KEY-06 | Autocomplete. | 1. Feld fokussieren. 2. Pfeile, Enter und Escape nutzen. | Auswahl funktioniert; ARIA-Attribute prüfen. | **Methode/Nachweis:** Quellcodeprüfung: Tastaturlogik vorhanden, aber keine Combobox-/Listbox-ARIA-Attribute. Interaktiver Tastaturlauf offen. | Teilweise getestet |
| KEY-07 | Viewer. | 1. Vollständigen Tab-Lauf durchführen. | Verborgene/gesperrte Bereiche sind nicht erreichbar. | Nicht getestet |
| KEY-08 | Dynamische Icon-Buttons. | 1. Mit Screenreader/Accessibility-Tree Namen prüfen. | Jeder Icon-Button hat eindeutigen Namen. | **Methode/Nachweis:** Chromium-Audit: dynamischer Papierkorb hat kein `aria-label`, keinen Titel und keinen Text; `tabIndex=0`. AX-Tree-Abfrage für dieses Node war in diesem Lauf technisch nicht verfügbar. | Teilweise getestet |

### Responsive Darstellung und Abhängigkeiten

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| RESP-01 | 1440, 1024, 768, 576 und 375 px. | 1. Lebensdaten, Sidebar und lange Werte prüfen. 2. `documentElement.scrollWidth` vergleichen. | Kein horizontaler Überlauf; keine abgeschnittenen Aktionen. | **Methode/Nachweis:** Chromium-Prüfung der fünf Breiten: Lebensdaten passen; bei 375 px globaler Überlauf aus Lebensstatus/Audit-Tabelle. Lange Extremwerte nicht eingesetzt. | Teilweise getestet |
| RESP-02 | Formularbreite etwa 800 px. | 1. Geburt/Tod und EDTF-Grid prüfen. | Keine gequetschte Zweispaltigkeit. | **Methode/Nachweis:** Chromium-Smoketest bei der tatsächlichen Formularbreite. Das Grid blieb einspaltig und zeigte keine gequetschte Zweispaltigkeit. | Bestanden |
| RESP-03 | Inhaltsbreite über 992 px testbar. | 1. Container Query mittels DevTools prüfen. | Geburt/Tod dürfen zweispaltig werden, weitere Daten volle Breite. | **Methode/Nachweis:** Quellcode-/Layoutprüfung: Formularspalte begrenzt auf `max-width:800px`; die bei `62rem` definierte Query ist damit im Ist-Layout nie erreichbar. Dies verletzt das Akzeptanzkriterium, keine externe Testblockade. | Fehlgeschlagen |
| RESP-04 | Lange Orte, IDs und EDTF-Interpretationen. | 1. Testdaten einfügen. 2. Bei allen Breiten prüfen. | Lesbarer Umbruch ohne Überlagerung. | Nicht getestet |
| RESP-05 | Netzwerkblockade. | 1. Bootstrap CSS/JS, Icons und EDTF jeweils einzeln blockieren. | Dokumentierte Ausfallwirkung und Fallbacks. | Nicht getestet |
| RESP-06 | Chromium, Firefox, Safari. | 1. Kernfälle ENV-01, ROLE-04, EDTF-02, DATA-02 wiederholen. | Gleichwertiges Ergebnis in freigegebenen Evergreen-Versionen. | **Methode/Nachweis:** Der Chromium-Smoke ist ausgeführt. Firefox ist lokal vorhanden; der Headless-Start am 31.07.2026 scheiterte jedoch an einem bereits laufenden Prozess/belegten Profil, daher wurden die vier Kernfälle dort nicht wiederholt. Safari steht in dieser Linux-Umgebung nicht zur Verfügung. Der Cross-Browser-Vergleich bleibt teilweise durchgeführt. | Teilweise getestet |
| RESP-07 | Aktueller Quellcode. | 1. `node --check` für JavaScript-Dateien ausführen. 2. `git diff --check` ausführen. | Syntaktisch sauber; keine unbeabsichtigten Änderungen. | **Methode/Nachweis:** Abschlusslauf vom 31.07.2026 nach dieser Checklistenänderung: `node --check` für alle JavaScript-Dateien und `git diff --check` ohne Ausgabe/Fehler. Der Git-Diff betrifft ausschließlich diese Checkliste. | Bestanden |

### Phase-1-Befunde mit eigener Regression

#### P1-ALERT-01 – fehlerhafte Alert-Klasse

- **Zweck/Testdaten:** Anzeigename mit bestehenden Demo-Daten.
- **Vorbedingung:** DB-Owner, helle Ansicht.
- **Schritte:** 1. Element bei `index.html:194` im DOM auswählen. 2. Klassen und berechnete Styles prüfen. 3. Mit Bootstrap-`alert-secondary` vergleichen.
- **Soll:** `class="alert alert-secondary mb-1"`; sekundärer Alert-Hintergrund, Text- und Rahmenstil.
- **Ist:** **Methode/Nachweis:** Chromium-Audit. Vorhanden ist `alert alert-sec ondary mb-1`; `alert-secondary` fehlt. Berechnet: transparenter Hintergrund und transparenter Rahmen (`rgba(0,0,0,0)`).
- **Status:** **Fehlgeschlagen**.
- **Einschränkung:** Nur bestehende Demoansicht geprüft; keine CSS-Korrektur in Phase 0.

#### P1-ORCID-01 – Ausgabe im Anzeigenamen

- **Zweck/Testdaten:** ORCID `0000-0002-1825-0097`, anschließend leerer Ausgangswert und Reset.
- **Vorbedingung:** DB-Owner, Anzeigename sichtbar.
- **Schritte:** 1. ORCID eintragen und `input` auslösen. 2. Suffix, Linktext und `href` prüfen. 3. Wert leeren und prüfen, dass kein ORCID-Suffix bleibt. 4. Reset auslösen.
- **Soll:** Vorhandener ORCID-Wert wird als Linktext und korrektes ORCID-Linkziel interpoliert; leerer Wert erzeugt keinen Suffix; Reset entfernt die Anzeige.
- **Ist:** **Methode/Nachweis:** Chromium-Audit für Schritt 1/2. Das erzeugte HTML enthält die Literale `${escapeHtml(url)}` und `${safeId}` statt des Werts; ein Link mit der ORCID als Text wurde nicht gefunden. Leerwert und der ORCID-spezifische Effekt eines Resets wurden nicht ausgeführt.
- **Status:** **Teilweise getestet**.
- **Einschränkung:** Die konkrete leere Darstellung wird vor einer ORCID-Korrektur nachgeprüft.

#### P1-I18N-01 – englische Beschriftungen

- **Zweck/Testdaten:** Deutsche Standardoberfläche, alle statischen Modale.
- **Vorbedingung:** Seite geladen.
- **Schritte:** 1. Quelltext und DOM nach englischen sichtbaren Texten/ARIA-Namen durchsuchen. 2. Betroffene Dialoge öffnen. 3. Gefundene Texte mit deutscher Zielbezeichnung protokollieren.
- **Soll:** Deutsche Beschriftungen: `Schließen`, `Abbrechen`, `Speichern`, `Nach oben`.
- **Ist:** **Methode/Nachweis:** Quellcodeprüfung. Fundstellen: `Back to Top` (`index.html:1835`), `aria-label="Close"` an mehreren Modal-Schließen-Buttons (`index.html:1855`, `1876`, `1897`, `2007`, `2101`, `2199`), `Cancel` und `Save` im Quellenmodal (`index.html:1993–1994`). Statische Fundstellen geprüft, Dialoge nicht einzeln geöffnet.
- **Status:** **Teilweise getestet**.
- **Einschränkung:** Keine Übersetzung in Phase 0.

#### P1-CONTRAST-01 – helle primäre, Erfolgs- und Gefahrbuttons

- **Zweck/Testdaten:** `.btn-primary`, `.btn-success`, `.btn-danger` im hellen Modus.
- **Vorbedingung:** CSS-Variablen aus `styles.css:1–18` und Buttonregel mit weißem Text auswerten.
- **Schritte:** 1. Opake Vorder-/Hintergrundwerte erfassen. 2. WCAG-Relativluminanz berechnen. 3. Mit WCAG 2.2 SC 1.4.3 (mindestens 4,5:1 für normalen Text) vergleichen.
- **Soll:** Weißer Buttontext erreicht mindestens 4,5:1.
- **Ist:** **Methode/Nachweis:** reproduzierbare Node-Kontrastberechnung. Weiß auf `#8fbce6`: **2,00:1**; Weiß auf `#a8d5b7`: **1,63:1**; Weiß auf `#e7a8b0`: **1,98:1**. Alle drei verfehlen SC 1.4.3.
- **Status:** **Fehlgeschlagen**.
- **Einschränkung:** Nur opake, im CSS definierte Farbpaare gemessen; keine Schätzung.

#### P1-CONTRAST-02 – dunkle primäre, Erfolgs- und Gefahrbuttons

- **Zweck/Testdaten:** Dieselben Buttonvarianten bei `[data-bs-theme="dark"]`.
- **Vorbedingung:** Dunkle Variablen aus `styles.css:98–111`.
- **Schritte:** 1. Opake Farben erfassen. 2. Kontrast gegen weißen Buttontext berechnen. 3. Gegen SC 1.4.3 prüfen.
- **Soll:** Weißer Buttontext erreicht mindestens 4,5:1.
- **Ist:** **Methode/Nachweis:** reproduzierbare Node-Kontrastberechnung. Weiß auf `#6fa0c9`: **2,78:1**; auf `#8bb99a`: **2,21:1**; auf `#c77f88`: **3,08:1**. Alle drei verfehlen SC 1.4.3.
- **Status:** **Fehlgeschlagen**.
- **Einschränkung:** Nur opake Farbpaare; Alert-Transparenzen sind ein eigener späterer Test.

#### P1-RESET-01 – einmaliger Reset auf Ausgangszustand

- **Zweck/Testdaten:** Geänderter Vorname, Rolle, Lebensstatus, dynamische Rolle, EDTF-Liste und Theme.
- **Vorbedingung:** DB-Owner; `window.confirm` im Testlauf bestätigt den Dialog.
- **Schritte:** 1. Werte und dynamischen Eintrag ändern. 2. Theme wechseln. 3. Reset bestätigen. 4. Rolle, Status, Grunddaten, dynamische Einträge, Validierungszustände und Theme prüfen.
- **Soll:** Definierter Ausgangszustand mit DB-Owner, Ausgangs-Lebensstatus, Ausgangsdaten und ohne dynamische Reste; dokumentierte Theme-Behandlung.
- **Ist:** **Methode/Nachweis:** Chromium-Audit. Nach Reset: Rolle `null`, Lebensstatus `null`, Vorname leer, dynamische Zeilen/EDTF-Liste/`.is-invalid` jeweils `0`; Theme blieb dunkel. Die fehlenden Standardradio-Auswahlen verletzen den Sollzustand.
- **Status:** **Fehlgeschlagen**.
- **Einschränkung:** Reihenfolge laut `form.js`: alle Controls leeren → dynamische Container leeren → EDTF-Liste leeren → Anzeigename leeren → Change-Events für bereits abgewählte Radios senden → Autocomplete erneut anbinden.

#### P1-RESET-02 – mehrfacher Reset und Event-Handler

- **Zweck/Testdaten:** Wiederholter Reset nach dynamischem Hinzufügen.
- **Vorbedingung:** Ausgangszustand wiederherstellbar.
- **Schritte:** 1. Dynamischen Eintrag hinzufügen. 2. Zweimal Reset bestätigen. 3. Wieder einen Eintrag hinzufügen. 4. Auf doppelte Listener, Datenreste und Rollen-/Statuszustand prüfen.
- **Soll:** Keine doppelten Handler, keine Reste, definierter Ausgangszustand.
- **Ist:** Noch nicht ausgeführt.
- **Status:** **Nicht getestet**.
- **Einschränkung:** Wegen P1-RESET-01 ist der definierte Rollen-Ausgangszustand aktuell bereits nicht erreichbar.

#### P1-ICON-01 – zugängliche Namen statischer und dynamischer Icon-Buttons

- **Zweck/Testdaten:** Statische Wirkungsort-Aktionen und dynamisch hinzugefügte Rollen-Zeile.
- **Vorbedingung:** DB-Owner; eine dynamische Rollen-Zeile erzeugen.
- **Schritte:** 1. Statische Bearbeiten-/Löschen-Buttons auf Symbol, `aria-label`, Titel und Tab-Reihenfolge prüfen. 2. Dynamischen Papierkorb erzeugen und gleich prüfen. 3. Namen im Accessibility Tree kontrollieren, sofern verfügbar.
- **Soll:** Jede Icon-Aktion hat einen eindeutigen zugänglichen Namen und ist mit Tastatur erreichbar.
- **Ist:** **Methode/Nachweis:** Chromium-Audit. Statische Buttons: z. B. `aria-label="Böhmischer Wald bearbeiten/entfernen"`, `tabIndex=0`. Dynamischer Papierkorb aus `addRolleToEntry()` (`form.js:363–367`): kein `aria-label`, kein Titel, kein Text, `tabIndex=0`. AX-Tree-Einzelabfrage war über die verfügbare CDP-Sitzung technisch nicht auflösbar.
- **Status:** **Teilweise getestet**.
- **Einschränkung:** Screenreader- und vollständige Accessibility-Tree-Prüfung vor der Korrektur wiederholen.

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
betroffenen Abschnitts erneut ausgeführt werden. Die Testbasis ist nach
Abschluss dieser Statuskorrekturen für Phase 1 geeignet. Noch offene manuelle
Tests verhindern den Beginn von Phase 1 nicht, müssen aber jeweils unmittelbar
vor und nach der zugehörigen Änderung ausgeführt und dokumentiert werden.
