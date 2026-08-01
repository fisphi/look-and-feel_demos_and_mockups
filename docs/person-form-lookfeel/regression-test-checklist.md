# Regressionstest-Checkliste – Personenformular

## Baseline

| Merkmal | Wert |
| --- | --- |
| Getesteter Commit | `22bc90c` (`test(person-form): add phase zero regression checklist`) |
| Testdatum | 31. Juli 2026 |
| Geltungsbereich | `docs/person-form-lookfeel` |
| Testart | Manuelle Regression, Quellcodeprüfung und Chromium-Smoke-Test |
| Phase | 0 – Testbasis schaffen; keine Produktlogik ändern |

Diese Checkliste begann als Phase-0-Baseline und wurde durch spätere Phase-1-,
Phase-2- und bereichsspezifische Nachprüfungen fortgeschrieben. Frühere
Ergebnisse bleiben als damalige Befunde erhalten; der aktuelle Befundstatus
ergibt sich aus den ausdrücklich datierten späteren Nachweisen und der
Statusübersicht am Ende dieses Dokuments. Ein historisch fehlgeschlagener Fall
ist kein Beleg dafür, dass derselbe Defekt heute noch besteht.

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
- **Offen**: ein Fehler, eine Warnung oder eine technische Einschränkung ist nach
  dem jüngsten dokumentierten Nachweis weiterhin vorhanden.
- **Behoben**: ein historischer Befund wurde durch eine spätere, tatsächlich
  ausgeführte Nachprüfung nachvollziehbar widerlegt beziehungsweise seine
  Korrektur belegt. Der ursprüngliche Teststatus bleibt unverändert dokumentiert.
- **Status zu verifizieren**: es gibt positive spätere Hinweise, aber keine
  vollständige Nachprüfung des ursprünglich betroffenen Umfangs.

## Historische Gesamtmatrix der ursprünglichen Baseline

Die ursprüngliche Phase-0-Gesamtzählung vom 31. Juli 2026 wird unverändert als
historischer Prüfstand bewahrt. Sie darf nicht als aktueller Gesamtstatus gelesen
werden:

| Prüfstand | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Phase-0-Baseline einschließlich der damals angelegten Phase-1-Befunde | 80 | 27 | 2 | 28 | 0 | 23 |

## Fortgeschriebene Matrix der ursprünglichen Testfallbasis

Die folgende Matrix zählt weiterhin genau die ursprünglichen 80 Testfälle,
verwendet aber den jeweils zuletzt **in der betreffenden Testfallzeile**
dokumentierten Status. Sie schließt die späteren, teilweise überlappenden
Phase-2-, Layout-, Aktions-, Sidebar- und Lebensdaten-Arbeitspakete nicht als
zusätzliche Fälle ein und ist deshalb keine aktuelle Gesamtmatrix aller Läufe.

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Umgebung und Ausgangszustand | 3 | 2 | 0 | 0 | 0 | 1 |
| Rollen und Viewer | 11 | 8 | 1 | 2 | 0 | 0 |
| Rollen- und Lebensstatuswechsel | 5 | 2 | 0 | 3 | 0 | 0 |
| EDTF | 10 | 1 | 0 | 7 | 0 | 2 |
| Dynamische Listen | 8 | 0 | 0 | 2 | 0 | 6 |
| Validierung | 8 | 2 | 0 | 3 | 0 | 3 |
| Export und Reset | 7 | 3 | 0 | 3 | 0 | 1 |
| Theme und Darstellung | 5 | 1 | 0 | 1 | 0 | 3 |
| Tastatur und Fokus | 8 | 0 | 0 | 3 | 0 | 5 |
| Responsive und Abhängigkeiten | 7 | 4 | 0 | 1 | 0 | 2 |
| Phase-1-Befunde | 8 | 7 | 0 | 1 | 0 | 0 |
| **Gesamt** | **80** | **30** | **1** | **26** | **0** | **23** |

## Aktueller dokumentierter Prüfstand

Eine belastbare numerische Gesamtmatrix über alle dokumentierten Nachprüfungen
ist nicht möglich: Die späteren Matrizen prüfen teils dieselben Rollen-,
Responsive-, Tastatur-, Export- und Resetfälle erneut, fassen sie aber mit
anderem Zuschnitt zusammen. Eine Addition würde dieselben Prüfungen mehrfach
zählen; eine nachträgliche Zerlegung wäre nicht durch die vorhandenen Nachweise
belegt. Der aktuelle Stand wird daher qualitativ in „Inzwischen behoben“,
„Weiterhin offen“ und „Status noch zu verifizieren“ zusammengefasst. Die
chronologischen Tabellen und Matrizen darunter behalten ihren jeweiligen
damaligen Geltungsbereich.

### Nachweis- und Umgebungsregister

Alle Fälle verwenden die oben beschriebene lokale HTTP-Umgebung. Die Einträge
im Feld „Tatsächliches Ergebnis“ sind zugleich der konkrete Nachweis:

- **Chromium-Smoke 31.07.2026:** Headless Chromium gegen `http://127.0.0.1:8765`; Rollen-, Viewer-, EDTF-, Listen-, Theme- und Reset-Abläufe.
- **Chromium-Audit 31.07.2026:** zusätzliche 12 Rollen-/Lebensstatuskombinationen, Alert-Klasse, ORCID-Ausgabe, dynamischer Papierkorb und Reset-Zustand.
- **Quellcodeprüfung 31.07.2026:** Fundstellen in `index.html`, `form.js`, `validation.js`, `styles.css` und `edtf-component.js`.
- **Parserprüfung 31.07.2026:** `window.EDTFForm.parseLevelOne()` in Chromium.
- **Kontrastberechnung 31.07.2026:** WCAG-Relativluminanzformel über die im Stylesheet definierten, opaken Hexfarben.
- **Phase-1-Regression 01.08.2026:** Chromium 150.0.7871.181 (Headless über DevTools) gegen lokalen HTTP-Server `http://127.0.0.1:8766`; Cache deaktiviert. Geprüft wurden alle zwölf Rollen-/Lebensstatuskombinationen, Viewer, Alert, ORCID, dynamische Icon-Buttons, Kontrast, Reset, Validierung und tatsächlicher JSON-Export. Die Hardware-Tastatureingabe lässt sich in dieser Headless-DevTools-Sitzung nicht auslösen; Fokus, Tabindex und Accessibility-Tree wurden dennoch geprüft.
- **Phase-2-Regression 01.08.2026:** Cachefreier Chromium-Lauf gegen `http://127.0.0.1:8766` mit Viewer-Zustandswechseln (verstorben/lebend/Owner), Theme-/Computed-Style-Prüfung, Überschriften- und Container-Query-Prüfung, sieben Viewportbreiten, Validierung, berechtigtem Export und Reset. Hardware-Tastatur und Forced Colors blieben technisch nicht simulierbar.
- **Phase-2-Aktionsnachprüfung 01.08.2026:** frische Chromium-150.0.7871.181-Headless-Sitzung über DevTools gegen `http://127.0.0.1:8766`, Cache beim Reload ignoriert. Geprüft wurden Aktionsgeometrie und DOM-Zugehörigkeit bei 320, 375, 768, 1024 und 1440 CSS-Pixeln in Hell/Dunkel, dynamische Listen, tatsächliche Tab-/Shift-Tab-Eingabe, Accessibility Tree, Viewer-Inertheit, Rollen-/Statuswechsel, Export und zweimaliger Reset.

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
| ROLE-01 | Neu geladen, DB-Owner. | 1. Sichtbare Abschnittslinks zählen. 2. Bearbeitungs- und Sidebar-Aktionen prüfen. 3. Export und Reset auslösen, Dialog/Download ggf. abbrechen. | Alle 13 Abschnitte und Aktionen sind verfügbar. | **Baseline:** Chromium-Smoke: 13 Abschnitte sowie Export/Reset sichtbar. **Phase 1, 01.08.2026:** Chromium 150/DevTools: alle 13 Abschnitte und Navigationslinks sichtbar; tatsächlicher JSON-Export und Reset separat erfolgreich ausgeführt (DATA-01/DATA-06). | Bestanden |
| ROLE-02 | Neu geladen. | 1. Record-Owner wählen. 2. Lebensstatus, Identität, Export und Reset prüfen. 3. Zu DB-Owner zurückwechseln. | Soll gemäß sichtbarer Rollenbeschreibung: alle Abschnitte sichtbar; `lebensstatus` und `identitaet` schreibgeschützt; Export und Reset sichtbar. Der bestehende Ist-Zustand kann diesem Soll widersprechen. | **Baseline:** Chromium-Smoke/Audit: alle Abschnitte, Export und Reset sichtbar; die beiden genannten Bereiche nicht deaktiviert. **Phase 1, 01.08.2026:** in allen drei Lebensstatus bestätigt: alle Bereiche sowie Export/Reset sichtbar, `lebensstatus` und `identitaet` weiterhin nicht deaktiviert. Kein Phase-1-Fix, da nicht als Phase-1-Befund beauftragt. | Fehlgeschlagen |
| ROLE-03 | Neu geladen. | 1. Record-Editor wählen. 2. Lebensstatus, Identität und Kontakt bedienen. 3. Übrige Abschnitte bedienen. | Lebensstatus, Identität und Kontakt sind deaktiviert; übrige Bereiche verfügbar. | **Baseline:** Chromium-Smoke: genau diese drei Abschnitte mit `disabled-section`. **Phase 1, 01.08.2026:** für verstorben, lebend und unbekannt erneut bestätigt; alle übrigen 10 Abschnitte und Export/Reset bleiben verfügbar. | Bestanden |
| ROLE-04 | Neu geladen. | 1. Record-Viewer wählen. 2. Sidebar, globale Aktionen und Abschnittslinks prüfen. 3. Vorherige Rolle wiederherstellen. | Nur freigegebene Viewer-Bereiche; Reset und Export verborgen/deaktiviert; keine veralteten Controls. | **Baseline:** Chromium-Smoke: Reset/Export verborgen. **Phase 1, 01.08.2026:** Viewer-Navigation und globale Aktionen für alle Lebensstatus geprüft; nur freigegebene Links sichtbar, Reset/Export jeweils `hidden` und `disabled`. | Bestanden |
| ROLE-05 | Jede Rolle nacheinander gewählt. | 1. Nach jedem Wechsel Tabulator drücken. 2. Deaktivierte/verborgene Bereiche prüfen. | Verborgene Controls sind nicht fokussierbar; disabled Controls können nicht schreiben. | **Phase 1, 01.08.2026:** alle zwölf Rollen-/Lebensstatuskombinationen auf `hidden`, `disabled` und Navigation geprüft. Vollständiger physischer Tab-Lauf bleibt offen, weil die Headless-DevTools-Sitzung Tastatureingaben nicht auslöste. | Teilweise getestet |

### Record-Viewer

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| VIEW-01 | Lebensstatus „verstorben“. | 1. Record-Viewer wählen. 2. Sichtbare Hauptabschnitte und Navigation notieren. | Nur Rollenwahl, Anzeigename und vorhandene Anmerkungen/Kommentare sichtbar. | **Baseline:** Chromium-Smoke: `userrolle`, `anzeigename`, `meta`; Kommentar-Trigger verborgen. **Phase 1, 01.08.2026:** Chromium 150/DevTools bestätigt genau diese drei Bereiche und drei Navigationslinks; Kommentare bleiben sichtbar, alle Schreib-Trigger verborgen/deaktiviert. **Phase 2, frische Sitzung 01.08.2026:** Matrixlauf erneut bestätigt; `record_history`/`import` verborgen, Reset/Export verborgen und deaktiviert. | Bestanden |
| VIEW-02 | Lebensstatus „lebend“. | 1. Record-Viewer wählen. 2. Identität und Quellen öffnen. 3. Sichtbare Identitätsfelder notieren. | Zusätzlich Vorname, Nachname und Quellen; sonst keine zusätzlichen Personendaten. | **Baseline:** Chromium-Smoke: `identitaet`/`quellenangaben` sichtbar, Identität nur `vorname`, `nachname`. **Phase 1, 01.08.2026:** erneut bestätigt; die beiden Controls sind disabled, die übrigen Identitätsfelder nicht gerendert. **Phase 2, frische Sitzung 01.08.2026:** lebender Viewer zeigte exakt `vorname`, `nachname`, `anzeigename`, `quellenangaben`, `meta`; technische Bereiche blieben verborgen. | Bestanden |
| VIEW-03 | Viewer, beide Lebensstatus getrennt. | 1. Kommentar-/Notiz-/Quellen-Trigger prüfen. 2. Tastaturaktivierung versuchen. 3. Modale im DOM prüfen. | Keine Schreibaktion erreichbar; relevante Modale sind inert. | **Baseline:** Kommentar-Trigger verborgen, Meta-Controls nicht aktiviert. **Phase 1, 01.08.2026:** alle Kommentar-, Notiz- und Quellen-Trigger im Viewer `hidden` und `disabled`; die zugehörigen Modale werden durch die Rollenlogik inert gesetzt. **Phase 2, frische Sitzung 01.08.2026:** `meta`-Controls nicht aktivierbar, alle drei Modale `inert=true`; Hardware-Enter konnte weiterhin nicht injiziert werden. | Bestanden |
| VIEW-04 | Viewer. | 1. Record History, Import und technische Metadaten über UI und Sidebar suchen. 2. Export/Reset/Speichern auslösen. | Bereiche und Aktionen nicht sichtbar bzw. nicht ausführbar. | **Baseline:** History/Import und Export/Reset verborgen. **Phase 1, 01.08.2026:** für lebend, verstorben und unbekannt bestätigt: History/Import nicht sichtbar, keine Sidebar-Links dafür; Reset/Export `hidden` und `disabled`; Quellen-Speichern verborgen. **Phase 2, frische Sitzung 01.08.2026:** alle drei Viewer-Lebensstatus und die technische Whitelist erneut geprüft; keine technischen Metadaten, Audit-/Importdaten oder Schreibaktionen sichtbar. | Bestanden |
| VIEW-05 | Viewer mit absichtlich leerem Nachnamen oder anderen Pflichtwerten. | 1. Export/Save-ähnliche Aktion anstoßen. 2. `validateForm()` in Konsole prüfen. | Keine Pflichtprüfung verborgener oder nicht bearbeitbarer Felder. | **Baseline:** Quellcodeprüfung des Viewer-Guards. **Phase 1, 01.08.2026:** `validateForm()` gab in allen drei Viewer-Lebensstatuskombinationen `true` zurück; globale Export-/Resetaktionen sind zugleich nicht erreichbar. **Phase 2, frische Sitzung 01.08.2026:** Nachname im verborgenen Identitätsabschnitt geleert; `validateForm()` blieb `true`. | Bestanden |
| VIEW-06 | Viewer. | 1. DevTools öffnen. 2. Verborgene DOM-Elemente und `collectPersonFormData` untersuchen. | Baseline dokumentiert, dass dies keine Zugriffskontrolle ist. | **Methode/Nachweis:** Quellcodeprüfung. **Sicherheitsbefund:** Sperren sind ausschließlich clientseitig; DOM und JavaScript bleiben lokal zugänglich. Produktion muss Abruf, Speicherung und Export serverseitig autorisieren. | Teilweise getestet |

### Rollen- und Lebensstatuswechsel

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| STATE-01 | DB-Owner, verstorben mit Sterbedatum. | 1. „lebend“ wählen. 2. Bestätigungsdialog einmal abbrechen, einmal bestätigen. | Abbruch stellt Status wieder her; Bestätigung löscht Sterbedatum bewusst und deaktiviert Todesfelder. | **Phase 1, 01.08.2026, Chromium 150/DevTools:** Abbruch ließ Status `verstorben` und `1884-07-18` unverändert. Bestätigung setzte `lebend`, leerte das Sterbedatum und deaktivierte Datum sowie Sterbeort. | Bestanden |
| STATE-02 | DB-Owner, lebend. | 1. „verstorben“ wählen. 2. Sterbedatum und Sterbeort bedienen. | Todesfelder werden wieder verfügbar. | **Phase 1, 01.08.2026, Chromium 150/DevTools:** Wechsel zurück auf `verstorben` reaktivierte Sterbedatum und Sterbeort. | Bestanden |
| STATE-03 | Viewer, verstorben. | 1. Auf lebend wechseln. 2. Sichtbarkeit prüfen. 3. Wieder verstorben wählen. | Identität/Quellen erscheinen nur bei lebend und verschwinden wieder vollständig. | **Baseline:** Erscheinen bei lebend, Rückwechsel offen. **Phase 1, 01.08.2026:** getrennte Viewerläufe für verstorben, lebend und unbekannt bestätigten die vollständigen Zielmengen; ein Statuswechsel im Viewer selbst ist wegen Read-only nicht verfügbar. **Phase 2, frische DevTools-Sitzung 01.08.2026:** mit `window.confirm=()=>true` wurde verstorben → lebend → verstorben ausgeführt; Zielmengen und Inertheit stimmten. Der native Bestätigungsdialog selbst wurde nur per Test-Stub bestätigt; Status bleibt daher teilweise getestet. | Teilweise getestet |
| STATE-04 | Alle vier Rollen. | 1. Jede Kombination aus Rolle und Lebensstatus wechseln. 2. Mehrfach hin- und herwechseln. | Keine alten Sichtbarkeits-, Disabled- oder Aktionszustände. | **Phase 1, 01.08.2026, Chromium 150/DevTools:** alle 12 Kombinationen geprüft. **Phase 2, frische Sitzung 01.08.2026:** alle 12 Kombinationen sowie Viewer/Owner/Editor-Rückwechsel und wiederholte Statuswechsel geprüft; keine stale Sichtbarkeit, Aktionen oder Validierungsabweichung. Der mehrfache Reset-Teil blieb wegen Reload-Verbindungsabbruch offen. | Teilweise getestet |
| STATE-05 | Record-Editor. | 1. Lebensstatus wählen. 2. Wechsel zu Owner und zurück. | Rollenrestriktionen bleiben nach Statuswechsel wirksam. | **Phase 1, 01.08.2026:** in allen drei Lebensstatus blieb die Record-Editor-Sperre auf `lebensstatus`, `identitaet` und `kontakt` erhalten. **Phase 2, frische Sitzung 01.08.2026:** Editor → lebend und anschließend Owner → verstorben ausgeführt; übrige Abschnitte/Aktionen blieben verfügbar. | Teilweise getestet |

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
| EDTF-10 | Nach EDTF-Änderungen. | 1. Reset auslösen. 2. Rollen wechseln. | Definierter Resetzustand ohne doppelte Listener oder Datenreste. | **Baseline:** Reset ließ Rolle und Lebensstatus leer. **Phase 1, 01.08.2026, Chromium 150/DevTools:** Reset nach einem zusätzlichen EDTF-Listeneintrag stellte DB-Owner, `verstorben`, die leere EDTF-Liste und den vollständigen Ausgangszustand her; nach dem zweiten Reset fügte ein einziger Klick genau einen Eintrag hinzu. | Bestanden |

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
| VAL-02 | DB-Owner, gültige Demo-Daten. | 1. Export auslösen. | Keine Validierungsfehler; Download wird erstellt. | **Baseline:** nur Serialisierung geprüft. **Phase 1, 01.08.2026, Chromium 150/DevTools:** `validateForm()` war mit Demo-Daten gültig; der echte Export-Handler erzeugte einen Download mit `person_…json`. Ein leerer Nachname lieferte `false` und setzte `.is-invalid`; nach Wiederherstellung erneut gültig. | Bestanden |
| VAL-03 | DB-Owner. | 1. Jede `data-validate`-Regel mit ungültigem Wert prüfen. 2. Korrigieren. | Feldnahe Fehlermeldung verschwindet nach Korrektur. | Nicht getestet |
| VAL-04 | DB-Owner. | 1. Ungültiges EDTF und ungültiges Intervall setzen. 2. Speichern/Export versuchen. | Live-Region und/oder Feldfehler; keine Übernahme. | **Methode:** Parserprüfung aus EDTF-06. **Nachweis:** Ungültige EDTF-Werte wurden abgewiesen. **Geprüft:** Parserablehnung der ungültigen Datumswerte. **Offen:** ungültiges Intervall, Live-Region/Feldfehler sowie Speichern/Export. **Voraussetzung für Vollprüfung:** interaktiver Validierungs- und Exportlauf. | Teilweise getestet |
| VAL-05 | Dynamische Pflichtfelder. | 1. Dynamischen Eintrag mit leerem Pflichtwert erzeugen. 2. Validieren. | Fehler am dynamischen Feld, keine falsche Prüfung anderer Felder. | Nicht getestet |
| VAL-06 | Viewer mit leeren Pflichtfeldern. | 1. `validateForm()` ausführen. | Rückgabe `true`; keine Fehler auf verborgenen Feldern. | **Methode/Nachweis:** Quellcodeprüfung des Viewer-Guards. **Phase 2, frische Sitzung 01.08.2026:** Nachname im verborgenen Identitätsabschnitt geleert; `validateForm()` blieb `true`, ohne Fehlerklasse auf dem verborgenen Feld. | Bestanden |
| VAL-07 | Fehlende Pflichtwerte. | 1. Export auslösen. 2. Fokus und Scrollposition beobachten. | Fokus bzw. Navigation zum ersten Fehler ist dokumentiert. | **Methode/Nachweis:** Quellcodeprüfung: kein Error-Summary/Fokusmanagement. Export- und Fokuslauf nicht ausgeführt. | Teilweise getestet |
| VAL-08 | Record-Editor. | 1. Deaktivierte Pflichtfelder leer lassen. 2. Export prüfen. | Nur aktive und relevante Felder werden validiert. | Nicht getestet |

### JSON-Export und Reset

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| DATA-01 | DB-Owner, Ausgangsdaten. | 1. Export klicken. 2. Download öffnen. | JSON enthält statische Ausgangsfelder. | **Baseline:** nur Datensammlung vor dem Export. **Phase 1, 01.08.2026, Chromium 150/DevTools:** echter Export-Handler mit abgefangenem Browser-Download erzeugte `person_…json`; JSON enthielt `vorname`, `nachname` und `lebensstatus` der Ausgangsdaten. | Bestanden |
| DATA-02 | DB-Owner. | 1. Feld, EDTF und dynamischen Eintrag ändern. 2. Export öffnen. | Kanonische EDTF-Werte und Arrays vorhanden. | **Methode/Nachweis:** Chromium-Smoke: `collectPersonFormData()` enthielt `datum_ohne_kontext: ["1874"]`. Downloaddatei wurde nicht geöffnet. | Teilweise getestet |
| DATA-03 | Viewer. | 1. Export-/Reset-Button und Tastatur prüfen. 2. Klick erzwingen. | Aktionen sind verborgen/deaktiviert und führen nichts aus. | **Methode/Nachweis:** Chromium-Smoke: beide Buttons verborgen; Quellcode blockiert Viewer im Handler. Erzwungener Klick und Tastatur nicht ausgeführt. | Teilweise getestet |
| DATA-04 | DB-Owner. | 1. Quelle, Tätigkeit, Wirkungsort und Liste ändern. 2. Export vergleichen. | Alle dynamischen Werte werden einmal, geordnet und ohne UI-Hilfswerte exportiert. | Nicht getestet |
| DATA-05 | DB-Owner. | 1. Theme wechseln. 2. Neu laden. 3. Reset auslösen. | Theme-Persistenz und Resetverhalten werden separat erfasst. | **Methode:** Chromium-Smoke. **Nachweis:** Der Theme-Wechsel wurde ausgelöst. **Phase 2, frische Sitzung 01.08.2026:** Reset für DB-Owner mit bestätigtem Dialog ausgeführt; Ausgangszustand wurde wiederhergestellt. Eine separate Persistenzprüfung über einen Browser-Neustart bleibt offen. | Teilweise getestet |
| DATA-06 | DB-Owner. | 1. Rolle, Status und dynamisches Datum ändern. 2. Reset bestätigen. 3. Gewählte Rolle, Status, Daten und Listener prüfen. | Definierter Ausgangszustand wird vollständig wiederhergestellt. | **Baseline:** alle Radios geleert, keine Rolle gewählt. **Phase 1, 01.08.2026, Chromium 150/DevTools:** nach Änderungen an Rolle, Status, Vorname, ORCID, Namensvarianten, Tätigkeiten, Wirkungsorten, EDTF-Liste und Validierung: DB-Owner, `verstorben`, `Ferdinand`, 3/1/8 Ausgangseinträge, leere EDTF-Liste, keine `.is-invalid`-Klasse und korrekte Disabled-Zustände. **Phase 2, frische Sitzung 01.08.2026:** Owner-Reset erneut mit geändertem Vorname, neuer Namensvariante und Exportprüfung bestätigt. Theme blieb wie bisher dunkel. | Bestanden |
| DATA-07 | Nach DATA-06. | 1. Mehrfach Reset ausführen. 2. Dynamischen Eintrag hinzufügen. | Keine doppelten Handler, keine Datenreste. | **Phase 1, 01.08.2026, Chromium 150/DevTools:** nach zweitem Reset erzeugte ein Klick auf „Namensvariante hinzufügen“ genau den vierten Eintrag; keine Datenreste oder doppelte Listener beobachtet. **Phase 2:** Ein erneuter Mehrfach-Reset-Versuch brach nach dem ersten `window.location.reload()` die bestehende DevTools-Verbindung ab; der zweite Reset und der anschließende Add-Klick waren in dieser Sitzung technisch nicht mehr abfragbar. Status bleibt auf Basis des nachgewiesenen Vorlaufs Bestanden, der neue Versuch ist als Einschränkung dokumentiert. | Bestanden |

### Hell- und Dunkelmodus

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| THEME-01 | Seite geladen. | 1. Theme-Button betätigen. 2. `data-bs-theme` prüfen. | Modus wechselt zwischen hell/dunkel. | **Methode/Nachweis:** Chromium-Smoke. Der Theme-Button änderte `data-bs-theme` zwischen hell und dunkel. | Bestanden |
| THEME-02 | Beide Modi. | 1. Formfelder, disabled/read-only, Fehler, Lebensstatus, Modale und Leerzustände prüfen. | Text und Zustände ausreichend lesbar; konkrete Probleme dokumentieren. | Nicht getestet |
| THEME-03 | Dunkelmodus. | 1. Neu laden. 2. `localStorage.theme` und Icon prüfen. | Gewählter Modus bleibt erhalten; Icon entspricht Gegenaktion. | Nicht getestet |
| THEME-04 | Beide Modi. | 1. Fokus mit Tastatur auf Button, Input, Link und Modal schließen. | Sichtbarer Fokus mit ausreichendem Kontrast. | **Methode/Nachweis:** Phase-2-Computed-Style-Prüfung bestätigte die globale `:focus-visible`-Regel; Theme-Farben wurden hell/dunkel berechnet. Hardware-Tab/Enter und Modal-Schließen per Tastatur waren in Headless nicht injizierbar. | Teilweise getestet |
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
| KEY-08 | Dynamische Icon-Buttons. | 1. Mit Screenreader/Accessibility-Tree Namen prüfen. | Jeder Icon-Button hat eindeutigen Namen. | **Methode/Nachweis:** Phase-2-AX-Tree in frischer Sitzung enthielt bei den nicht ignorierten Buttons keine namenlosen Nodes; programmgesteuerter Fokus und `tabIndex=0` bestätigt. Vollständige Screenreader- und Hardware-Tastaturprüfung bleibt offen. | Teilweise getestet |

### Responsive Darstellung und Abhängigkeiten

| ID | Vorbedingung | Schritte | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- | --- | --- |
| RESP-01 | 1440, 1024, 768, 576 und 375 px. | 1. Lebensdaten, Sidebar und lange Werte prüfen. 2. `documentElement.scrollWidth` vergleichen. | Kein horizontaler Überlauf; keine abgeschnittenen Aktionen. | **Methode/Nachweis:** Phase-2-Cachefree Chromium-Lauf mit sieben Breiten (320, 375, 576, 768, 1024, 1280, 1440): `scrollWidth === clientWidth` in allen Fällen; bei 1280/1440 zwei Lebensdaten-Spalten, darunter eine. Lange Extremwerte nicht zusätzlich eingesetzt. | Bestanden |
| RESP-02 | Formularbreite etwa 800 px. | 1. Geburt/Tod und EDTF-Grid prüfen. | Keine gequetschte Zweispaltigkeit. | **Methode/Nachweis:** Chromium-Smoketest bei der tatsächlichen Formularbreite. Das Grid blieb einspaltig und zeigte keine gequetschte Zweispaltigkeit. | Bestanden |
| RESP-03 | Inhaltsbreite über 992 px testbar. | 1. Container Query mittels DevTools prüfen. | Geburt/Tod dürfen zweispaltig werden, weitere Daten volle Breite. | **Baseline:** Formularspalte begrenzt auf `max-width:800px`; Query unerreichbar. **Phase 2, frische Sitzung 01.08.2026:** benannte 64-rem-Container-Query wurde bei 1280/1440px real aktiviert (515px/515px), bei 1024px blieb das Layout einspaltig. | Bestanden |
| RESP-04 | Lange Orte, IDs und EDTF-Interpretationen. | 1. Testdaten einfügen. 2. Bei allen Breiten prüfen. | Lesbarer Umbruch ohne Überlagerung. | Nicht getestet |
| RESP-05 | Netzwerkblockade. | 1. Bootstrap CSS/JS, Icons und EDTF jeweils einzeln blockieren. | Dokumentierte Ausfallwirkung und Fallbacks. | Nicht getestet |
| RESP-06 | Chromium, Firefox, Safari. | 1. Kernfälle ENV-01, ROLE-04, EDTF-02, DATA-02 wiederholen. | Gleichwertiges Ergebnis in freigegebenen Evergreen-Versionen. | **Methode/Nachweis:** Der Chromium-Smoke ist ausgeführt. Firefox ist lokal vorhanden; der Headless-Start am 31.07.2026 scheiterte jedoch an einem bereits laufenden Prozess/belegten Profil, daher wurden die vier Kernfälle dort nicht wiederholt. Safari steht in dieser Linux-Umgebung nicht zur Verfügung. Der Cross-Browser-Vergleich bleibt teilweise durchgeführt. | Teilweise getestet |
| RESP-07 | Aktueller Quellcode. | 1. `node --check` für JavaScript-Dateien ausführen. 2. `git diff --check` ausführen. | Syntaktisch sauber; keine unbeabsichtigten Änderungen. | **Baseline:** Abschlusslauf 31.07.2026 ohne Syntax-/Whitespace-Fehler. **Phase 1, 01.08.2026:** `node --check` für `autocomplete-data.js`, `edtf-component.js`, `form.js`, `theme.js` und `validation.js` sowie `git diff --check` ohne Ausgabe/Fehler. **Phase 2, 01.08.2026:** alle fünf JavaScript-Dateien erneut ohne Fehler; Diff umfasst ausschließlich die fünf erwarteten Phase-2-Dateien. | Bestanden |

### Phase-1-Befunde mit eigener Regression

#### P1-ALERT-01 – fehlerhafte Alert-Klasse

- **Zweck/Testdaten:** Anzeigename mit bestehenden Demo-Daten.
- **Vorbedingung:** DB-Owner, helle Ansicht.
- **Schritte:** 1. Element bei `index.html:194` im DOM auswählen. 2. Klassen und berechnete Styles prüfen. 3. Mit Bootstrap-`alert-secondary` vergleichen.
- **Soll:** `class="alert alert-secondary mb-1"`; sekundärer Alert-Hintergrund, Text- und Rahmenstil.
- **Ist:** **Methode/Nachweis:** Chromium-Audit. Vorhanden ist `alert alert-sec ondary mb-1`; `alert-secondary` fehlt. Berechnet: transparenter Hintergrund und transparenter Rahmen (`rgba(0,0,0,0)`).
- **Baseline-Status:** **Fehlgeschlagen**.
- **Phase-1-Nachprüfung (01.08.2026, Chromium 150/DevTools):** Klasse ist `alert alert-secondary mb-1`; der Alert ist in Hell- und Dunkelmodus sichtbar, mit nicht transparentem Sekundärhintergrund und Rahmen.
- **Status:** **Bestanden**.
- **Historische Phase-0-Einschränkung:** Nur die bestehende Demoansicht wurde
  geprüft; in Phase 0 erfolgte noch keine CSS-Korrektur.

#### P1-ORCID-01 – Ausgabe im Anzeigenamen

- **Zweck/Testdaten:** ORCID `0000-0002-1825-0097`, anschließend leerer Ausgangswert und Reset.
- **Vorbedingung:** DB-Owner, Anzeigename sichtbar.
- **Schritte:** 1. ORCID eintragen und `input` auslösen. 2. Suffix, Linktext und `href` prüfen. 3. Wert leeren und prüfen, dass kein ORCID-Suffix bleibt. 4. Reset auslösen.
- **Soll:** Vorhandener ORCID-Wert wird als Linktext und korrektes ORCID-Linkziel interpoliert; leerer Wert erzeugt keinen Suffix; Reset entfernt die Anzeige.
- **Ist:** **Methode/Nachweis:** Chromium-Audit für Schritt 1/2. Das erzeugte HTML enthält die Literale `${escapeHtml(url)}` und `${safeId}` statt des Werts; ein Link mit der ORCID als Text wurde nicht gefunden. Leerwert und der ORCID-spezifische Effekt eines Resets wurden nicht ausgeführt.
- **Baseline-Status:** **Teilweise getestet**.
- **Phase-1-Nachprüfung (01.08.2026, Chromium 150/DevTools):** `0000-0002-1825-0097` und der geänderte Wert `0000-0003-1415-9262` erzeugen jeweils Linktext und korrektes `https://orcid.org/…`-Ziel; Leerwert und Reset entfernen den Suffix; kein Template-Platzhalter blieb im DOM.
- **Status:** **Bestanden**.
- **Historische Phase-0-Einschränkung:** Leerwert und Reset waren damals noch
  offen; die oben dokumentierte Phase-1-Nachprüfung führte beide Fälle aus.

#### P1-I18N-01 – englische Beschriftungen

- **Zweck/Testdaten:** Deutsche Standardoberfläche, alle statischen Modale.
- **Vorbedingung:** Seite geladen.
- **Schritte:** 1. Quelltext und DOM nach englischen sichtbaren Texten/ARIA-Namen durchsuchen. 2. Betroffene Dialoge öffnen. 3. Gefundene Texte mit deutscher Zielbezeichnung protokollieren.
- **Soll:** Deutsche Beschriftungen: `Schließen`, `Abbrechen`, `Speichern`, `Nach oben`.
- **Ist:** **Methode/Nachweis:** Quellcodeprüfung. Fundstellen: `Back to Top` (`index.html:1835`), `aria-label="Close"` an mehreren Modal-Schließen-Buttons (`index.html:1855`, `1876`, `1897`, `2007`, `2101`, `2199`), `Cancel` und `Save` im Quellenmodal (`index.html:1993–1994`). Statische Fundstellen geprüft, Dialoge nicht einzeln geöffnet.
- **Baseline-Status:** **Teilweise getestet**.
- **Phase-1-Nachprüfung (01.08.2026, Quelltext und Chromium 150/DevTools):** `Nach oben`, alle Modalnamen `Schließen` sowie `Abbrechen`/`Speichern` im Quellenmodal bestätigt; die dokumentierten englischen Fundstellen sind nicht mehr vorhanden.
- **Status:** **Bestanden**.
- **Historische Phase-0-Einschränkung:** In Phase 0 erfolgte noch keine
  Übersetzung; die spätere Phase-1-Nachprüfung ist separat dokumentiert.

#### P1-CONTRAST-01 – helle primäre, Erfolgs- und Gefahrbuttons

- **Zweck/Testdaten:** `.btn-primary`, `.btn-success`, `.btn-danger` im hellen Modus.
- **Vorbedingung:** CSS-Variablen aus `styles.css:1–18` und Buttonregel mit weißem Text auswerten.
- **Schritte:** 1. Opake Vorder-/Hintergrundwerte erfassen. 2. WCAG-Relativluminanz berechnen. 3. Mit WCAG 2.2 SC 1.4.3 (mindestens 4,5:1 für normalen Text) vergleichen.
- **Soll:** Weißer Buttontext erreicht mindestens 4,5:1.
- **Ist:** **Methode/Nachweis:** reproduzierbare Node-Kontrastberechnung. Weiß auf `#8fbce6`: **2,00:1**; Weiß auf `#a8d5b7`: **1,63:1**; Weiß auf `#e7a8b0`: **1,98:1**. Alle drei verfehlen SC 1.4.3.
- **Baseline-Status:** **Fehlgeschlagen**.
- **Phase-1-Nachprüfung (01.08.2026, berechnete Browserfarben und WCAG-Relativluminanz):** Vordergrund `#0f172a`; Hellmodus: primär **8,93:1**, Erfolg **10,94:1**, Gefahr **9,03:1**. Alle erfüllen SC 1.4.3 für normalen Text.
- **Status:** **Bestanden**.
- **Einschränkung:** Nur opake, im CSS definierte Farbpaare gemessen; keine Schätzung.

#### P1-CONTRAST-02 – dunkle primäre, Erfolgs- und Gefahrbuttons

- **Zweck/Testdaten:** Dieselben Buttonvarianten bei `[data-bs-theme="dark"]`.
- **Vorbedingung:** Dunkle Variablen aus `styles.css:98–111`.
- **Schritte:** 1. Opake Farben erfassen. 2. Kontrast gegen weißen Buttontext berechnen. 3. Gegen SC 1.4.3 prüfen.
- **Soll:** Weißer Buttontext erreicht mindestens 4,5:1.
- **Ist:** **Methode/Nachweis:** reproduzierbare Node-Kontrastberechnung. Weiß auf `#6fa0c9`: **2,78:1**; auf `#8bb99a`: **2,21:1**; auf `#c77f88`: **3,08:1**. Alle drei verfehlen SC 1.4.3.
- **Baseline-Status:** **Fehlgeschlagen**.
- **Phase-1-Nachprüfung (01.08.2026, berechnete Browserfarben und WCAG-Relativluminanz):** Vordergrund `#0f172a`; Dunkelmodus: primär **6,42:1**, Erfolg **8,08:1**, Gefahr **5,80:1**. Alle erfüllen SC 1.4.3 für normalen Text.
- **Status:** **Bestanden**.
- **Einschränkung:** Nur opake Farbpaare; Alert-Transparenzen sind ein eigener späterer Test.

#### P1-RESET-01 – einmaliger Reset auf Ausgangszustand

- **Zweck/Testdaten:** Geänderter Vorname, Rolle, Lebensstatus, dynamische Rolle, EDTF-Liste und Theme.
- **Vorbedingung:** DB-Owner; `window.confirm` im Testlauf bestätigt den Dialog.
- **Schritte:** 1. Werte und dynamischen Eintrag ändern. 2. Theme wechseln. 3. Reset bestätigen. 4. Rolle, Status, Grunddaten, dynamische Einträge, Validierungszustände und Theme prüfen.
- **Soll:** Definierter Ausgangszustand mit DB-Owner, Ausgangs-Lebensstatus, Ausgangsdaten und ohne dynamische Reste; dokumentierte Theme-Behandlung.
- **Ist:** **Methode/Nachweis:** Chromium-Audit. Nach Reset: Rolle `null`, Lebensstatus `null`, Vorname leer, dynamische Zeilen/EDTF-Liste/`.is-invalid` jeweils `0`; Theme blieb dunkel. Die fehlenden Standardradio-Auswahlen verletzen den Sollzustand.
- **Baseline-Status:** **Fehlgeschlagen**.
- **Phase-1-Nachprüfung (01.08.2026, Chromium 150/DevTools):** Nach Änderungen an Rolle, Status, Grunddaten, ORCID, Namensvarianten, Tätigkeit, Wirkungsort, EDTF-Liste und Validierung lädt Reset die definierte Demo-Ausgangslage wieder: DB-Owner, `verstorben`, `Ferdinand`, 3 Namensvarianten, 1 Tätigkeit, 8 Wirkungsorte, keine EDTF-Reste und keine Validierungsfehler. Der Themezustand bleibt wie im Baseline-Verhalten erhalten.
- **Status:** **Bestanden**.
- **Historische Phase-0-Einschränkung:** Die damalige `form.js`-Reihenfolge
  lautete: Controls leeren → dynamische Container leeren → EDTF-Liste leeren →
  Anzeigename leeren → Change-Events für bereits abgewählte Radios senden →
  Autocomplete erneut anbinden. Die spätere Nachprüfung bezieht sich auf den
  korrigierten Reload-Ablauf.

#### P1-RESET-02 – mehrfacher Reset und Event-Handler

- **Zweck/Testdaten:** Wiederholter Reset nach dynamischem Hinzufügen.
- **Vorbedingung:** Ausgangszustand wiederherstellbar.
- **Schritte:** 1. Dynamischen Eintrag hinzufügen. 2. Zweimal Reset bestätigen. 3. Wieder einen Eintrag hinzufügen. 4. Auf doppelte Listener, Datenreste und Rollen-/Statuszustand prüfen.
- **Soll:** Keine doppelten Handler, keine Reste, definierter Ausgangszustand.
- **Ist:** Noch nicht ausgeführt.
- **Baseline-Status:** **Nicht getestet**.
- **Phase-1-Nachprüfung (01.08.2026, Chromium 150/DevTools):** Nach zweimaligem Reset erzeugt ein einzelner Klick genau eine vierte Namensvariante; Rolle und Lebensstatus sind weiterhin DB-Owner beziehungsweise `verstorben`. Keine Listener- oder Datenreste beobachtet.
- **Status:** **Bestanden**.
- **Historische Phase-0-Einschränkung:** Wegen des damaligen P1-RESET-01 war der
  definierte Rollen-Ausgangszustand zunächst nicht erreichbar. Die Phase-1- und
  späteren Mehrfach-Reset-Nachprüfungen belegen die Aufhebung dieser
  Voraussetzung.

#### P1-ICON-01 – zugängliche Namen statischer und dynamischer Icon-Buttons

- **Zweck/Testdaten:** Statische Wirkungsort-Aktionen und dynamisch hinzugefügte Rollen-Zeile.
- **Vorbedingung:** DB-Owner; eine dynamische Rollen-Zeile erzeugen.
- **Schritte:** 1. Statische Bearbeiten-/Löschen-Buttons auf Symbol, `aria-label`, Titel und Tab-Reihenfolge prüfen. 2. Dynamischen Papierkorb erzeugen und gleich prüfen. 3. Namen im Accessibility Tree kontrollieren, sofern verfügbar.
- **Soll:** Jede Icon-Aktion hat einen eindeutigen zugänglichen Namen und ist mit Tastatur erreichbar.
- **Ist:** **Methode/Nachweis:** Chromium-Audit. Statische Buttons: z. B. `aria-label="Böhmischer Wald bearbeiten/entfernen"`, `tabIndex=0`. Dynamischer Papierkorb aus `addRolleToEntry()` (`form.js:363–367`): kein `aria-label`, kein Titel, kein Text, `tabIndex=0`. AX-Tree-Einzelabfrage war über die verfügbare CDP-Sitzung technisch nicht auflösbar.
- **Baseline-Status:** **Teilweise getestet**.
- **Phase-1-Nachprüfung (01.08.2026, Chromium 150/DevTools):** statische Info-, Theme-, Namensvarianten- und Rollen-Aktionen sowie dynamische Namensvariante, Rolle und Wirkungsort haben aussagekräftige `aria-label`s. Der Accessibility-Tree enthält keinen reinen Bootstrap-Icon-Glyphennamen; dynamische Namen folgen Wertänderungen. Alle geprüften Buttons haben `tabIndex=0` und sind programmatisch fokussierbar. Echte Enter-Auslösung blieb in dieser Headless-DevTools-Sitzung trotz dokumentiertem Fokus nicht injizierbar.
- **Status:** **Teilweise getestet**.
- **Verbleibende Einschränkung:** Eine vollständige manuelle Screenreader- und
  Hardware-Tastaturprüfung aller betroffenen dynamischen Aktionen ist nicht
  dokumentiert; deshalb bleibt der laufübergreifende Status zu verifizieren.

## Phase-2-Nachprüfung

### Prüfregister

| Merkmal | Wert |
| --- | --- |
| Ausgangscommit vor Phase 2 | `b1fb30a` (`fix(person-form): stabilize accessibility and baseline behavior`) |
| Testdatum | 01. August 2026 |
| Umgebung | Chromium 150.0.7871.181 headless über DevTools, lokaler HTTP-Server `127.0.0.1:8766`, Cache bei den Nachprüfungen deaktiviert |
| Methode | Browser-Smoke/DOM- und Computed-Style-Prüfung, Viewport-Messung, Quelltext- und Syntaxprüfung, WCAG-Kontrastberechnung |
| Nachweis | Die folgenden Ergebnisse stammen aus den tatsächlich ausgeführten Browser- und Node-Läufen; nicht ausführbare Hardware-/Forced-Colors-Schritte sind ausdrücklich als teilweise getestet markiert. |

### Record-Viewer-Gate vor Phase 2

- **Methode/Nachweis:** Chromium vor der Phase-2-Änderung, zunächst DB-Owner und anschließend Record-Viewer. Im verstorbenen Zustand waren ausschließlich `userrolle`, `anzeigename` und `meta` sichtbar; Record History, Import, Identität, Lebensdaten, Quellen und übrige Abschnitte waren verborgen/inert. Kommentar-, Anmerkungs- und Quellenaktionen sowie Reset/Export waren verborgen und deaktiviert; `validateForm()` lieferte `true`.
- **Zustandswechsel:** DB-Owner → Record-Viewer → DB-Owner wurde ausgeführt und stellte die Owner-Ansicht vollständig wieder her. Der Wechsel verstorben → lebend wurde in diesem Vorlauf durch den nativen Bestätigungsdialog der Headless-Sitzung blockiert; die bereits dokumentierte Phase-1-Regression enthielt den lebenden Viewerzustand und alle zwölf Rollen-/Lebensstatuskombinationen.
- **Nach-Phase-2-Nachweis:** Cachefreier Chromium-Lauf mit bestätigtem Dialog prüfte Record-Viewer verstorben → lebend → verstorben sowie anschließend → DB-Owner. Verstorben zeigte nur `userrolle`, `anzeigename`, `meta`; lebend ergänzte `identitaet` und `quellenangaben`; in beiden Viewerzuständen waren Reset/Export verborgen/deaktiviert, alle drei Modale `inert` und `validateForm()` wahr. Die Rückkehr zum DB-Owner stellte alle regulären Abschnitte und Aktionen wieder her.
- **Bewertung:** Kein kritischer Viewer-Befund. Es wurden keine nicht freigegebenen Daten oder schreibenden Viewer-Aktionen erreichbar; die Headless-Dialogeinschränkung bleibt als teilweise getestet offen.

### Phase-2-Arbeitspakete und Nachweise

#### P2-TOKENS-01 – semantische Tokens und Bootstrap-Abbildung

- **Baseline:** `styles.css` enthielt ausschließlich verstreute Bootstrap-Variablen und direkte Werte; kein Produkt-Token-Namespace.
- **Nachweis:** `:root` enthält die dokumentierten Farb-, Typografie-, Raum-, Größen-, Radius-, Schatten-, Bewegungs- und Ebenen-Tokens. Bootstrap-Variablen werden daraus abgeleitet; der Dark-Block überschreibt nur die vorgesehenen semantischen Gegenwerte.
- **Status:** **Bestanden**.

#### P2-TYPE-01 – Überschriftenhierarchie

- **Baseline:** Kein `h1`, statische Ebenen enthielten `h2` bis `h6`.
- **Nachweis:** Cachefreier Chromium-DOM-Lauf: genau **1 `h1`**, **0 `h5`**, **0 `h6`**; dynamische EDTF-Überschriften sind ebenfalls auf `h2`–`h4` umgestellt.
- **Status:** **Bestanden**.

#### P2-FOCUS-01 – Fokus, Controls, Labels und Fehler

- **Baseline:** Kein globaler `:focus-visible`-Standard; Controlhöhen und Hilfetexte waren nicht formularweit tokenisiert.
- **Nachweis:** Computed-Style/Stylesheet-Prüfung bestätigt eine globale `:focus-visible`-Regel mit 2px Ring, Token-Controlhöhe (40px im Standardzustand), tokenisierte Labels/Hilfe/Fehler und Forced-Colors-Fallback. Hardware-Tab-/Enter-Eingabe war in der Headless-DevTools-Sitzung nicht injizierbar.
- **Status:** **Teilweise getestet**.

#### P2-STATE-01 – `.has-value`

- **Baseline:** Befüllte Felder erhielten einen grünen `.has-value`-Ring.
- **Nachweis:** CSS-Regeln und `form.js` enthalten keine `.has-value`-Erzeugung mehr; Validierungszustände `.is-valid`/`.is-invalid` bleiben unverändert.
- **Status:** **Bestanden**.

#### P2-LAYOUT-01 – Workbench, Container Query und Layout-Primitives

- **Baseline:** Inline-`max-width:800px` begrenzte die Formularspalte; die 62rem-Container-Query war dadurch unerreichbar.
- **Nachweis:** Keine Inline-Breitenbegrenzung mehr; `.ui-workbench` nutzt `--content-width-form:70rem`, der Lebensdatencontainer ist benannt und verwendet die 64rem-Schwelle. Chromium zeigte bei 1280px und 1440px zwei Lebensdaten-Spalten, darunter eine Spalte. Cachefreier Viewport-Lauf ergab an 320, 375, 576, 768, 1024, 1280 und 1440px jeweils identische `scrollWidth`/`clientWidth` ohne horizontalen Seitenüberlauf.
- **Status:** **Bestanden**.

#### P2-COMPONENTS-01 – Button-, Icon-Button- und Notice-Grundvarianten

- **Baseline:** Button-/Alert-Styling war ausschließlich über verstreute Bootstrap-Overrides definiert.
- **Nachweis:** `.ui-button`, `.ui-icon-button`, `.ui-notice` einschließlich Primär-, Sekundär-, Danger-, Info-, Success- und Forced-Colors-Regeln sind vorhanden; bestehende Bootstrap-Klassen bleiben funktionsfähig.
- **Status:** **Bestanden**.

#### P2-THEME-01 – Hell-, Dunkel- und Forced-Colors-Darstellung

- **Baseline:** Helle/dunkle Werte waren separat und direkt kodiert; Forced Colors fehlte.
- **Nachweis:** Chromium-Computed-Styles bestätigten helles Token `#2563a6`, dunkle Akzentfarbe `#75aee8`, passende Vordergründe und unveränderte Theme-Umschaltung. Forced Colors ist per CSS berücksichtigt, konnte in der Headless-Umgebung aber nicht aktiviert werden.
- **Status:** **Teilweise getestet**.

#### P2-CONTRAST-01 – neue Token-Farbpaare

- **Nachweis:** WCAG-Relativluminanzberechnung: Hellmodus Weiß auf Primär **6,15:1**, Erfolg **5,33:1**, Gefahr **6,49:1**; Dunkelmodus dunkler Text auf Akzent **7,97:1**, Weiß auf Erfolg **5,33:1**, Gefahr **6,49:1**. Alle erfüllen SC 1.4.3 für normalen Text.
- **Status:** **Bestanden**.

#### P2-CHECKS-01 – Syntax und Diff-Hygiene

- **Nachweis:** `node --check` für `form.js`, `validation.js`, `edtf-component.js`, `theme.js` und `autocomplete-data.js` ohne Fehler; `git diff --check` ohne Befund. Die Browser-Nachprüfung bestätigte: leeres Pflichtfeld → `validateForm() === false` und `.is-invalid`, wiederhergestellter Wert → `true`; DB-Owner-Reset stellte `kurator`, `verstorben`, `Ferdinand`, leere ORCID und drei Ausgangs-Namensvarianten wieder her; Viewer-Reset blieb verborgen/deaktiviert; der berechtigte Export rief `URL.createObjectURL` mit einem Blob auf. Keine Testinfrastruktur oder automatisierten Repository-Tests vorhanden.
- **Status:** **Bestanden**.

### Phase-2-Abdeckungsmatrix

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Record-Viewer-Gate vor/nach Phase 2 | 1 | 0 | 0 | 1 | 0 | 0 |
| Tokens und Bootstrap-Mapping | 1 | 1 | 0 | 0 | 0 | 0 |
| Typografie und Überschriften | 1 | 1 | 0 | 0 | 0 | 0 |
| Fokus, Controls und Fehler | 1 | 0 | 0 | 1 | 0 | 0 |
| `.has-value`-Entfernung | 1 | 1 | 0 | 0 | 0 | 0 |
| Workbench und Responsive Layout | 1 | 1 | 0 | 0 | 0 | 0 |
| Button/Icon/Notice-Grundvarianten | 1 | 1 | 0 | 0 | 0 | 0 |
| Theme und Forced Colors | 1 | 0 | 0 | 1 | 0 | 0 |
| Kontrast | 1 | 1 | 0 | 0 | 0 | 0 |
| Syntax und Diff | 1 | 1 | 0 | 0 | 0 | 0 |
| **Phase 2 gesamt** | **10** | **7** | **0** | **3** | **0** | **0** |

## Phase-2-Nachprüfung – Layout- und Strukturkorrekturen

### Prüfregister

| Merkmal | Wert |
| --- | --- |
| Testdatum | 01. August 2026 |
| Umgebung | Frische Chromium-150.0.7871.181-Headless-DevTools-Sitzung, lokaler HTTP-Server `127.0.0.1:8766`, Cache beim Reload ignoriert |
| Methode | Browser-Computed-Style- und DOM-Prüfung bei 1280, 768, 576 und 320 CSS-Pixeln; dynamischer Add-Smoke; JavaScript-Syntax- und Diff-Prüfung |
| Nachweis | CDP-Ausgaben für Radio-/Gender-/Normdatenwerte, Input-/Button-Geometrie, Tätigkeiten-DOM und Add-Aktions-Eltern; `node --check`, `xmllint --html --noout`, `git diff --check` |

### Tatsächliche Ergebnisse

- **Radios/Checkboxen:** Alle vier Geschlechtsradios berechnet mit `16×16px`, `inline-size/block-size: 16px` und `flex: 0 0 16px`. `.gender-options` ist `display:flex`, `flex-wrap:wrap`, `gap:12px 20px`.
- **Normdaten:** Bei 1280px Formcontainerbreite `1120px` werden zwei Spalten (`523px 523px`) verwendet. Bei 768px (`729px`) und 576px (`537px`) wird innerhalb des Containers einspaltig angeordnet. Bei 320px (`281px`) bleibt die Gruppe einspaltig; die Eingabe belegt `223px`, der Suchbutton steht in der nächsten Zeile (`y=3903.16` gegenüber `y=3857.16`) und behält seine vollständige Breite (`147.66px`). In den größeren Fällen bleibt `flex-wrap: nowrap`, der Button behält `white-space: nowrap` und schrumpft nicht.
- **Tätigkeiten:** Der Browser-DOM enthält genau eine Tätigkeiten-Karte und genau einen direkten `.card-body`; nach „Tätigkeitszeitraum hinzufügen“ existieren zwei Einträge. Rollen- und Tätigkeitsaktionen liegen in `.section-actions`.
- **Gemeinsame Add-Aktionen:** Nach dem dynamischen Add-Smoke liegen Namensvariante, Datum, beide Rollenaktionen, Tätigkeitszeitraum, Wirkungsort, Quellenangabe und Anmerkung jeweils direkt in `.section-actions` (8 geprüfte Aktionen).
- **Abschlussprüfungen:** `node --check` für `autocomplete-data.js`, `edtf-component.js`, `form.js`, `theme.js` und `validation.js` sowie `git diff --check` ohne Fehler. `xmllint --html --noout index.html` beendet sich mit Exit 0; der Parser meldet weiterhin die bestehenden HTML5-Warnungen zu rohem `&` und `<section>` im HTML4-Modus, keinen neuen Strukturabbruch.

### Abdeckungsmatrix der Nachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Radio-/Checkbox-Geometrie und Gender-Wrap | 1 | 1 | 0 | 0 | 0 | 0 |
| Containerbasierte Normdaten und Suchaktion | 1 | 1 | 0 | 0 | 0 | 0 |
| Tätigkeiten-Kartenstruktur | 1 | 1 | 0 | 0 | 0 | 0 |
| Gemeinsame Add-Aktionsstruktur | 1 | 1 | 0 | 0 | 0 | 0 |
| Syntax, HTML-Smoke und Diff-Hygiene | 1 | 1 | 0 | 0 | 0 | 0 |
| **Nachprüfung gesamt** | **5** | **5** | **0** | **0** | **0** | **0** |

## Phase-2-Nachprüfung – Aktionspositionierung und Struktur

### Prüfregister

| Merkmal | Wert |
| --- | --- |
| Testdatum | 01. August 2026 |
| Umgebung | Frische Chromium-150.0.7871.181-Headless-DevTools-Sitzung, lokaler HTTP-Server `127.0.0.1:8766`, cachefreier Reload |
| Viewports und Themes | 320, 375, 768, 1024 und 1440 CSS-Pixel; jeweils Hell- und Dunkelmodus |
| Methode | Browser-DOM, Bounding-Rects, Scroll-/Client-Geometrie, Computed Styles, echte CDP-Tab-/Shift-Tab-Eingabe, Accessibility Tree, Rollen-/Status- und dynamische Interaktion, Quelltext-, Syntax-, Parser- und Diff-Prüfung |

### Erhaltener Vorher-Befund

- **Aktionsbreiten:** Vor der Korrektur berechnete Chromium alle Textbuttons, deren einziges Elementkind ein Bootstrap-Icon war, als `36×36px` mit `padding:0`. Das betraf unter anderem alle drei „Kommentar abgeben“, „Neue Anmerkung hinzufügen“, „Erklärung“, Namensvariante, Rolle, Tätigkeitszeitraum, Wirkungsort und Quelle. Die Labels liefen aus den Buttons heraus (`scrollWidth > clientWidth`), obwohl die Button-Rechtecke selbst innerhalb ihrer Karten lagen.
- **Ursache:** `.btn:has(> .bi:only-child)` wertete Textknoten nicht als CSS-Kinder und erfasste deshalb auch Buttons mit Icon **und** sichtbarem Text. Die Hoverregeln verschoben mehrere Buttonvarianten zusätzlich per `translateY(-1px)`.
- **Tätigkeiten-DOM:** In der tatsächlichen Baseline enthielt `.timeline-list` auch `#taetigkeiten-container` und die äußere Add-Aktion; der schließende Timeline-Tag fehlte. Der frühere Nachweis „ein direkter `.card-body`“ war dafür nicht hinreichend und bleibt oben als damaliger Befund nachvollziehbar erhalten.
- **Anmerkungszuordnung:** Die drei Kommentarbuttons lagen bereits in ihren drei Anmerkungskarten. „Neue Anmerkung hinzufügen“ lag bereits genau einmal nach der Liste im äußeren Anmerkungsbereich. „Erklärung“ lag im Record-History-Header. Der nachgewiesene Darstellungsfehler entstand dort durch die erzwungene Iconbutton-Breite, nicht durch absolute Positionierung.

### Tatsächliche Ergebnisse nach Korrektur

- **DOM und CSS:** `.timeline-list` endet nun vor `#taetigkeiten-container`; der Abschnitt besitzt genau einen direkten `.card-body`. Jede Anmerkung besitzt eine eigene `.entry-actions`, die Liste genau eine äußere `.section-actions`. Der History-Header verwendet die umbrechende Struktur `.card-header-layout > h2 + .card-header-actions`. Es gibt an diesen Aktionen keine absolute/fixe Position, negativen Abstände oder Transform-Verschiebungen. Die Quadratregel gilt nur noch für tatsächlich beschriftete Icon-only-Buttons; dekorative Icons der Textaktionen sind `aria-hidden`.
- **Responsive Matrix:** In allen zehn Kombinationen aus fünf Breiten und zwei Themes gab es keinen horizontalen Seitenüberlauf, keinen Inhaltsüberlauf der Add-Aktionen, keine Kartenüberschreitung und keine Überlagerung mit Folgebereichen. Kommentar, neue Anmerkung und Erklärung blieben jeweils einzeilig. Bei 320px brechen nur die drei längsten allgemeinen Add-Beschriftungen kontrolliert innerhalb ihres Buttons um; bei Platzangebot bleiben sie einzeilig. Der History-Button steht bei 320/375px unter dem Titel, sonst rechts im Header, stets ohne Überschneidung.
- **Zuordnung:** Drei Kommentarbuttons gehören jeweils exakt zu einer der drei Anmerkungskarten. „Neue Anmerkung hinzufügen“ steht genau einmal unter der letzten Karte und vor Record History. Die Matrix zählte `3` Anmerkungskarten, `3` Kommentaraktionen, `1` äußere Anmerkungsaktion und `0` verschachtelte `.section-actions` in Einzelkarten. Keine doppelten IDs.
- **Dynamische Listen:** Ein Klick erhöhte Namensvarianten `3→4`, zwei Klicks Tätigkeiten `1→3` und zwei Klicks Wirkungsorte `8→10`; Entfernen stellte jeweils `3`, `1` und `8` wieder her. Jede der geprüften Listen hatte genau eine äußere `.section-actions`; keine doppelten Einträge oder IDs durch Handler beobachtet.
- **Nachtrag 01.08.2026 – Tätigkeiten/Rollen:** Ein statischer und ein neu erzeugter Tätigkeitsdatensatz wurden im gerenderten DOM direkt verglichen: identische `.taetigkeiten-entry`-Wrapper, gleicher Header, gleiche Feldreihenfolge, gleiche Autocomplete-Wrapper, gleiche EDTF-Intervall-Einbettung und identische `.dynamic-field-row`-Rollenzeilen; nur laufende Nummern und Leerwerte unterschieden sich. Die Rollen-Eingaben blieben pro Eintrag konsistent als `rollen_#[]` benannt. Im neuen Datensatz aktualisierte sich der zugängliche Löschname auf `Rolle „Forscher“ entfernen`; nach Rollen-Hinzufügen sprang der Fokus auf die neue Zeile, nach Entfernen auf die verbleibende Zeile. Das Rollen-Autocomplete zeigte für `Sam` zwei Treffer (`Sammler`, `Sammlerin`), Institution und Wirkungsort öffneten ihre Dropdowns auch im neu erzeugten Eintrag. Drei Tätigkeiten wurden zu `#1/#2/#3` ergänzt und nach Entfernen des dritten Eintrags wieder konsistent zu `#1/#2` neu nummeriert. Bei `375px` bestand weiterhin `0px` horizontaler Überlauf; Export erzeugte erneut einen Blob-Download und Reset stellte `1` Tätigkeit mit `1` Rollen-Zeile `Sammler` wieder her.
- **Anmerkungs-/Kommentar-Mock:** Die statischen Modale besitzen keine Fachlogik zum Persistieren neuer Anmerkungen oder Kommentare. „Speichern“ verändert die drei vorhandenen Anmerkungskarten nicht (`3→3`). Ein dynamischer Hinzufügen-/Entfernen-Nachweis ist daher in diesem clientseitigen Mockup nicht ausführbar und wurde nicht ergänzt.
- **Accessibility und Tastatur:** Reale CDP-Tab-/Shift-Tab-Eingabe erreichte „Kommentar abgeben“, „Neue Anmerkung hinzufügen“ und „Erklärung“ und kehrte jeweils korrekt zurück. Der Accessibility Tree führte alle drei verständlichen Namen; dynamische Icon-only-Namen blieben wertbezogen. Damit ist die frühere Headless-Einschränkung für diesen neuen Lauf überwunden; der historische Teilstatus wird nicht rückwirkend überschrieben.
- **Viewer und Zustandswechsel:** Verstorben zeigte exakt `userrolle`, `anzeigename`, `meta`; lebend ergänzte exakt `identitaet` mit `vorname`/`nachname` und `quellenangaben`. Verstorben → lebend → verstorben, lebend → verstorben → lebend, Viewer → Owner und Owner → Viewer → Owner wurden ausgeführt. Kommentare/Anmerkungen enthielten keine editierbaren Felder. Kommentar-, Anmerkungs-, Quellen-, Save-, Reset-, Export- und Erklärungsaktionen waren im Viewer nicht fokussierbar; die relevanten Modale waren inert und keine dieser Aktionen erschien im Accessibility Tree. Record History und Import blieben verborgen/inert; `validateForm()` ergab in beiden Viewerzuständen `true` ohne Alert. Die übrigen drei Rollen behielten ihre bisherigen Sichtbarkeiten und Sperren.
- **Export und Reset:** Der berechtigte Export durchlief den tatsächlichen Click-Handler und erzeugte einen Blob-Link mit Dateiname `person_2026-07-31T23-18-31.json`. Zwei nacheinander ausgelöste Resets stellten jeweils `kurator`, `verstorben`, `Hochstetter`, `1` Tätigkeit, `8` Wirkungsorte, `3` Kommentaraktionen, `0` Validierungsfehler, `0` offene Modale und keine doppelten IDs wieder her.
- **Abschlussprüfungen:** `node --check` für `form.js`, `validation.js` und `edtf-component.js` ohne Befund; keine bestehende automatisierte Testinfrastruktur gefunden; Browser-Fehler-/Promise-/`console.error`-Erfassung leer; `git diff --check` ohne Befund. Der Browser-DOM bestätigte die korrigierte Karten-/Aktionsstruktur. `xmllint --html` meldet weiterhin bestehende HTML4-Modus-Warnungen für HTML5-Tags, rohe Ampersands, Inline-JavaScript und die bereits vorhandenen ungültig verschachtelten Listen in Record History; diese nicht aktionsbezogenen Bestandswarnungen wurden nicht auf Verdacht geändert.

### Abdeckungsmatrix der Aktionsnachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline, Ursache und DOM-Zuordnung | 1 | 1 | 0 | 0 | 0 | 0 |
| Responsive Aktionsgeometrie, Hell/Dunkel | 1 | 1 | 0 | 0 | 0 | 0 |
| Tätigkeiten- und gemeinsame Aktionsstruktur | 1 | 1 | 0 | 0 | 0 | 0 |
| Dynamische Namens-, Tätigkeits- und Ortslisten | 1 | 1 | 0 | 0 | 0 | 0 |
| Dynamische Anmerkungs-/Kommentar-Fachlogik | 1 | 0 | 0 | 1 | 0 | 0 |
| Viewer, Rollen- und Lebensstatuswechsel | 1 | 1 | 0 | 0 | 0 | 0 |
| Tastatur, Fokus und Accessibility Tree | 1 | 1 | 0 | 0 | 0 | 0 |
| Validierung, Export und mehrfacher Reset | 1 | 1 | 0 | 0 | 0 | 0 |
| JavaScript, Browserkonsole und Diff | 1 | 1 | 0 | 0 | 0 | 0 |
| Gesamte HTML-Parserprüfung | 1 | 0 | 0 | 1 | 0 | 0 |
| **Aktionsnachprüfung gesamt** | **10** | **8** | **0** | **2** | **0** | **0** |

## Phase-2-Nachprüfung – gemeinsames Seitenlayout

### Prüfregister und Vorher-Befund

| Merkmal | Wert |
| --- | --- |
| Testdatum | 01. August 2026 |
| Umgebung | Chromium 150.0.7871.181 headless über DevTools, lokaler HTTP-Server `127.0.0.1:8766`, cachefreier Reload |
| Methode | Browser-DOM, Bounding-Rects, Grid-/Position-Computed-Styles und Scrollmessung bei 320, 768, 1024, 1100, 1101, 1280, 1440, 1600 und 1920 CSS-Pixeln |
| Baseline | `.ui-workbench { width:100% }` konkurrierte mit `col-lg-9`; bei 1280/1440px brach die Sidebar unter das Formular. Bei 1920px lag sie daneben, begann aber erst **157,375px** nach dem Formular. |

### Tatsächliche Ergebnisse nach Korrektur

- **Struktur:** `.page-layout` besitzt genau zwei direkte Kinder: `.form-main.ui-workbench` und `.form-sidebar`. Bootstrap-Spalten, `order-*`, `justify-content:space-between` und separate rechtsbündige Wrapper werden für das äußere Layout nicht mehr verwendet.
- **Breites Layout:** Bei 1600 und 1920px misst der zentrierte Container `1450px`, das Formular `1050px`, die Sidebar `360px` und der reale Zwischenraum konstant `32px`. Bei 1101, 1280 und 1440px bleibt der Abstand ebenfalls `32px`; die Formularspur schrumpft kontrolliert mit `minmax(0, …)`.
- **Sticky:** Ab 1101px ist `.form-sidebar` `position:sticky; top:16px`; nach Scrollen blieb die gemessene Oberkante bei `16px`. Die innere Sidebar bleibt scrollbar, wenn ihr Inhalt die verfügbare Höhe überschreitet.
- **Einspaltig:** Bei 320, 768, 1024 und 1100px berechnete Chromium genau eine Grid-Spalte. `.form-sidebar` war `position:static`, ohne eigene Höhenbegrenzung oder inneren Scrollzwang. Kein geprüfter Viewport hatte horizontalen Dokumentüberlauf.
- **Regression:** Die bestehende Aktionsprüfung bei 320, 375, 768, 1024 und 1440px bestätigte weiterhin Karten-Containment, vollständige Labels, genau drei Kommentarbuttons, eine äußere Anmerkungsaktion, einen Tätigkeiten-Card-Body und keine doppelten IDs.

### Abdeckungsmatrix der Seitenlayout-Nachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Gemeinsamer Grid-Container und DOM-Struktur | 1 | 1 | 0 | 0 | 0 | 0 |
| Abstand, Zentrierung und Spurbreiten | 1 | 1 | 0 | 0 | 0 | 0 |
| Sticky-Verhalten | 1 | 1 | 0 | 0 | 0 | 0 |
| Einspaltiger Umbruch und Überlauf | 1 | 1 | 0 | 0 | 0 | 0 |
| Aktions- und Strukturregression | 1 | 1 | 0 | 0 | 0 | 0 |
| **Seitenlayout gesamt** | **5** | **5** | **0** | **0** | **0** | **0** |

## Phase-2-Nachprüfung – schmalere Sidebar

| Merkmal | Tatsächliches Ergebnis | Status |
| --- | --- | --- |
| Ausgangszustand | Der unmittelbar vorherige Grid-Stand verwendete eine Sidebar bis `360px`, `32px` Gap und `1450px` Gesamtbreite. Dieser Zwischenstand bleibt im vorherigen Abschnitt dokumentiert. | Bestanden |
| Breite und Abstand | Chromium maß bei 1101, 1280, 1440, 1600 und 1920px jeweils eine Sidebar von `240px` und einen Abstand von exakt `24px`. Ab 1440px: Formular `1050px`, Sidebar `240px`, Gesamtcontainer zentriert mit `1314px`. | Bestanden |
| Navigationstexte | Alle 13 `.nav-link`-Elemente wurden an neun Viewports auf `scrollWidth/clientWidth` und `scrollHeight/clientHeight` geprüft: kein abgeschnittener oder überlaufender Link. `white-space:normal` und `overflow-wrap:anywhere` erlauben bei künftig längeren Namen kontrollierten Umbruch. | Bestanden |
| Sticky und Breakpoint | Ab 1101px blieb die Sidebar nach Scrollen bei `top:16px`; bis einschließlich 1100px war sie statisch in einer einzigen Grid-Spalte. | Bestanden |
| Überlauf | 320, 768, 1024, 1100, 1101, 1280, 1440, 1600 und 1920px jeweils ohne horizontalen Dokumentüberlauf. | Bestanden |

### Abdeckungsmatrix der Sidebar-Nachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Breite, Abstand und Zentrierung | 1 | 1 | 0 | 0 | 0 | 0 |
| Textumbruch und Abschneiden | 1 | 1 | 0 | 0 | 0 | 0 |
| Sticky und einspaltiger Breakpoint | 1 | 1 | 0 | 0 | 0 | 0 |
| Responsive Überlaufprüfung | 1 | 1 | 0 | 0 | 0 | 0 |
| **Sidebar gesamt** | **4** | **4** | **0** | **0** | **0** | **0** |

## Lebensdaten-Nachprüfung – visuelle und funktionale Feinbereinigung

### Prüfregister

| Merkmal | Wert |
| --- | --- |
| Testdatum | 01. August 2026 |
| Umgebung | Frische Chromium-150.0.7871.181-Headless-DevTools-Sitzung, lokaler HTTP-Server `127.0.0.1:8766`, cachefreie Reloads |
| Viewports und Themes | 320, 375, 768, 1024 und 1440 CSS-Pixel; jeweils Hell- und Dunkelmodus |
| Methode und Nachweis | Browser-DOM, Bounding-Rects, Computed Styles, Screenshots, Accessibility Tree, echte CDP-Tab-/Enter-/Escape-Eingaben, Rollen-/Status-/EDTF-Interaktionen, Export-/Reset-Smoke, Syntax-, HTML-Parser- und Diff-Prüfung |

### Erhaltener Ausgangsbefund

- **Bearbeitungsumfang:** Der Stift öffnete ausschließlich das jeweilige
  Geburts- oder Sterbedatumsmodal. Die Modale enthielten nur EDTF-Teile
  (Genauigkeit, Jahr, Monat, Tag und Bewertung), nicht die Ortsfelder. Geburt
  und Tod besitzen im Bestand keinen gemeinsamen Ereignis-Bearbeitungsmodus.
- **Ortsfelder:** Geburts- und Sterbeort waren für berechtigte Rollen reguläre,
  dauerhaft editierbare Eingaben; ein separater Anzeigemodus existierte nicht.
  Bei Lebensstatus `lebend` wurde der Sterbeort zwar deaktiviert, behielt im
  Quellstand aber die nicht mehr passende Aufforderung „Sterbeort eingeben oder
  auswählen“.
- **Datumszeile:** Bei 1024px belegte das Grid nur `752px` eines `919px` breiten
  Ereignisblocks, bei 1440px nur `752px` von `1016px`. Ursache waren
  `max-width:47rem`, feste Bootstrap-Spalten und die Kombination aus
  `.row`-Gutters und eigenem Grid. Die Interpretation war ein `<code>`-Element
  und berechnete wie der EDTF-Rohwert die Monospace-Schrift.
- **Leerzustand:** Der Browser gab zwei getrennte, inhaltlich überlappende Sätze
  aus: „Noch keine weiteren Datumsangaben erfasst.“ und „Datumsangaben, die
  keinem konkreten Lebensereignis zugeordnet werden können.“
- **Sidebar:** Bereits vor dieser Korrektur betrugen Sidebarbreite und Abstand
  bei 1440px `240px` beziehungsweise `24px`; sie war sticky und lag als direktes
  Geschwister neben dem Formular. Dieser bestehende Zielzustand wurde bewahrt.

### Tatsächliche Ergebnisse nach Korrektur

- **DOM und Layout:** EDTF-Rohwert, flexible Interpretation und kompakte
  Aktionsspalte verwenden ein gemeinsames CSS-Grid ohne konkurrierende
  Bootstrap-Row-/Col-Geometrie. Das Grid belegt nun bei 1024px die vollständigen
  `919px` und bei 1440px `1016px`; der Rohwert misst `220px`, die Interpretation
  flexibel `631px`/`728px`, der Stift `36px` am rechten Zeilenrand. Bei 320px und
  375px stehen EDTF-Wert und Stift in der ersten, die Interpretation in der
  zweiten Zeile. Alle zehn Breiten-/Theme-Kombinationen hatten `0px`
  horizontalen Dokumentüberlauf, keine Überlagerung und kein Kartenübertreten.
- **Typografie und Zuordnung:** Nur der EDTF-Rohwert bleibt `<code>` und
  Monospace. Die Interpretation ist ein `<span>` in der normalen UI-Schrift.
  Der Accessibility Tree führte „Geburtsdatum bearbeiten“, „Sterbedatum
  bearbeiten“, „EDTF-Datum erklären“ und „Datum ohne Kontext hinzufügen“.
  Damit bleibt der tatsächliche date-only Umfang der Stifte eindeutig.
- **Orte und Überschriften:** Die dauerhaft editierbaren Ortsfelder blieben
  Eingaben; Werte und Bindungen wurden nicht verändert. Bei `lebend` ist der
  Sterbeort nativ deaktiviert und zeigt neutral „Nicht erfasst“; nach Rückkehr
  zu `verstorben` wird die Eingabeaufforderung wiederhergestellt. Die belegten,
  knappen Abschnittstitel „Geburt“ und „Tod“ blieben unverändert.
- **Weitere Lebensdaten:** Der Leerzustand lautet einmalig „Noch keine weiteren
  Datumsangaben erfasst. Hier können Datumsangaben ergänzt werden, die keinem
  konkreten Lebensereignis zugeordnet sind.“ Die Add-Aktion blieb innerhalb der
  Karte in `.section-actions`. Browserinteraktionen belegten Hinzufügen `1900`,
  Bearbeiten zu `1901`, Entfernen, Abbrechen eines neuen Entwurfs, korrekte
  Leerzustandsrückkehr und Fokus-Rückgabe an die Add-Aktion.
- **EDTF und Fokus:** Geburt wurde gültig auf `1830-05-12` geändert und als „12.
  Mai 1830“ interpretiert; `2023-02-31` erzeugte im geöffneten Modal die
  Kalenderfehlermeldung und `aria-invalid=true`. Ortswerte blieben dabei
  unverändert. Tab fokussierte den Stift mit sichtbarem Outline; Enter öffnete
  das Modal, Escape schloss es und gab den Fokus an „Geburtsdatum bearbeiten“
  zurück. Keine doppelten IDs wurden gefunden.
- **Lebensstatus und Rollen:** Der abgebrochene Wechsel `verstorben → lebend`
  erhielt Datum, Ortfreigabe und Status. Der bestätigte Wechsel löschte das
  Sterbedatum, deaktivierte Sterbeort und Stift und verwendete den neutralen
  Platzhalter. Mehrfache Wechsel stellten Sichtbarkeit, Disabled-Zustand und
  ursprünglichen Platzhalter wieder her. DB-Owner, Record-Owner und
  Record-Editor behielten ihre bisherigen Lebensdatenrechte; beim Record-Editor
  blieb nur der Lebensstatus wie zuvor gesperrt.
- **Record-Viewer:** Verstorben waren exakt `userrolle`, `anzeigename` und
  `meta` sichtbar; lebend zusätzlich `identitaet` mit Vorname/Nachname und
  `quellenangaben`. Lebensdatenaktionen waren verborgen, deaktiviert und auch
  per JavaScript-Klick nicht auslösbar. Kommentare/Anmerkungen enthielten keine
  editierbaren Controls; Kommentar-, Anmerkungs- und Quellenmodale waren inert,
  Record History und Import verborgen/inert. `validateForm()` ergab im Viewer
  `true`; Reset und Export blieben verborgen und deaktiviert. Mehrfache
  Viewer-/Owner-Wechsel stellten alle Owner-Aktionen wieder her.
- **Export und Reset:** Der berechtigte Export durchlief den Click-Handler und
  erzeugte einen Blob-Link `person_2026-07-31T23-56-00.json`; ein Viewer-Klick
  erzeugte keinen weiteren Download. Zwei aufeinanderfolgende Resets stellten
  jeweils Rolle `kurator`, Status `verstorben`, Geburtsdatum `1829-04-30`,
  Sterbedatum `1884-07-18`, leere Orte, den editierbaren Sterbeort-Platzhalter,
  null weitere Lebensdaten, null Validierungsfehler und null doppelte IDs her.
- **Sidebar:** Bei 1440px weiterhin `240px` breit, mit `24px` Abstand und
  `position:sticky; top:16px`; bis 1024px einspaltig und statisch. Keine
  Sidebar-Regel musste geändert werden.
- **Technik:** `node --check` bestand für `edtf-component.js`, `form.js`,
  `validation.js`, `autocomplete-data.js` und `theme.js`; eine automatisierte
  Paket-/Testinfrastruktur ist nicht vorhanden. `git diff --check` bestand.
  Die Browsererfassung enthielt keine JavaScript-Ausnahme und keinen
  formularseitigen Console-Fehler, aber bestehende 404-Netzwerkfehler für
  `site.webmanifest`, `favicon.ico`, `favicon.svg` und `favicon-96x96.png`.
  `xmllint --html --noout` endete mit Exit 0, meldete im HTML4-Modus weiterhin
  die bereits dokumentierten HTML5-, Ampersand-, Inline-Script- und
  Record-History-Listenwarnungen; diese fremden Befunde blieben unverändert.

### Abdeckungsmatrix der Lebensdaten-Nachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ausgangsbefund, Bearbeitungsumfang und Ursachen | 1 | 1 | 0 | 0 | 0 | 0 |
| Responsive Datumszeilen und Hell-/Dunkelmodus | 1 | 1 | 0 | 0 | 0 | 0 |
| Ortsfelder und mehrfache Lebensstatuswechsel | 1 | 1 | 0 | 0 | 0 | 0 |
| EDTF gültig/ungültig und weitere Lebensdaten | 1 | 1 | 0 | 0 | 0 | 0 |
| Rollen- und vollständige Record-Viewer-Regression | 1 | 1 | 0 | 0 | 0 | 0 |
| Accessibility Tree, Tastatur, Fokus und IDs | 1 | 1 | 0 | 0 | 0 | 0 |
| Export und mehrfacher Reset | 1 | 1 | 0 | 0 | 0 | 0 |
| JavaScript-Syntax und Diff-Hygiene | 1 | 1 | 0 | 0 | 0 | 0 |
| Browserkonsole einschließlich externer Assets | 1 | 0 | 0 | 1 | 0 | 0 |
| Gesamte HTML-Parserprüfung | 1 | 0 | 0 | 1 | 0 | 0 |
| **Lebensdaten-Nachprüfung gesamt** | **10** | **8** | **0** | **2** | **0** | **0** |

## Phase-3.2-Nachprüfung – Identität als zweiter Komponentenpilot

### Testdatum, Umgebung und Ausgangszustand

- **Datum:** 01.08.2026.
- **Umgebung:** Chromium 150.0.7547.0, lokaler HTTP-Server,
  cache-deaktivierte frische DevTools-/CDP-Sitzungen unter Linux; Viewports 375,
  768, 1024 und 1440px jeweils in Hell- und Dunkelmodus.
- **Methode:** Gerendertes DOM, Computed Styles, Scroll- und Geometriemessungen,
  Accessibility Tree, native CDP-Tastaturereignisse, tatsächliche Click-/Change-
  Handler, Blob-Export-Stub und vollständiges Browser-Reload für Reset. Syntax
  und HTML-Struktur wurden zusätzlich statisch geprüft.
- **Ausgangszustand vor Phase 3.2:** Der Identitätsbereich verwendete
  Bootstrap-Row-/Col-Strukturen ohne neutrale Field-Komponente. Die
  Geschlechtsauswahl hatte kein `fieldset`/`legend`. Statische
  Namensvarianten-Inputs hatten weder eindeutige IDs noch zugängliche Labels;
  ein Leerzustand fehlte. Nach Hinzufügen erhielt das neue Feld keinen Fokus,
  nach Entfernen fiel der Fokus auf `body`. Der Nachnamefehler war nicht über
  `aria-describedby` zugeordnet, `aria-invalid` fehlte und die Fehlerklasse
  blieb nach erneuter gültiger Eingabe bestehen. Die drei Demo-Namensvarianten,
  Namen, Titel, Rollen-, Viewer- und Lebensstatuszustände waren vorhanden und
  wurden vor der Änderung als Referenz gesichert.

### Tatsächliche Ergebnisse nach Phase 3.2

| Bereich | Methode und Nachweis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- |
| Field-Anatomie und Semantik | DOM- und AX-Tree-Prüfung in frischer Sitzung. | Vor-, Mittel-, Nachname, Namenskürzel, Titel und Namensvarianten verwenden gemeinsame neutrale Field-/Grid-/Short-List-Primitives. „Geschlecht“ erscheint als benannte Gruppe mit vier benannten Radios. Labels, Hilfetext und Pflichtfeldfehler sind eindeutig zugeordnet; keine doppelten IDs. | Bestanden |
| Responsive Layout und Themes | Geometriemessung und Screenshots bei 375/768/1024/1440px, jeweils hell/dunkel, mit langen Mittel-, Titel- und Variantenwerten. | 375px einspaltig, 768px zweispaltig, ab 1024px drei Namensspalten und zwei Titelspalten. Die Radiooptionen umbrechen bei Bedarf. In allen acht Kombinationen `0px` Dokument- und Abschnittsüberlauf, keine Überlagerung oder abgeschnittene Aktion; Controls einheitlich 38px bei 375px und 40px ab 768px. | Bestanden |
| Anzeigename und Fachdatenbindung | Vor-, Mittel- und Nachname per tatsächlichem `input`-Event geändert; `collectPersonFormData()` geprüft. | Ausgabe änderte sich auf „Ada Augusta Lovelace“, der exportierbare Nachname auf `Lovelace`; EDTF-Ausgangswerte blieben vor den Statusprüfungen `1829-04-30` und `1884-07-18`. Keine Template- oder Platzhalterausgabe. | Bestanden |
| Namensvarianten 0/1/n | Alle drei Demozeilen über ihre tatsächlichen Löschaktionen entfernt, anschließend ein und drei Einträge hinzugefügt, einen mittleren Eintrag entfernt und Formulardaten gesammelt. | Bei 0 Einträgen erscheint der Leerzustand und der Fokus liegt auf „Namensvariante hinzufügen“. Hinzufügen fokussiert den neuen Input; monotone IDs `namensvariante-4` bis `-6` bleiben eindeutig. Entfernen fokussiert die nächste Zeile. Wertbezogene Namen aktualisierten sich, etwa „Namensvariante „Ada King“ entfernen“. Der Datensatz enthielt danach exakt `Ada King` und `Augusta Ada`. | Bestanden |
| Pflichtfeld und Fehlerzustand | Nachname geleert, `validateForm()` ausgeführt, anschließend Wert wiederhergestellt und erneut validiert. | Ungültig: `false`, `.is-invalid`, `aria-invalid=true`, Zuordnung zu `nachname-error`. Nach Eingabe: `true`, Fehlerklasse und `aria-invalid` entfernt. | Bestanden |
| Titel-Autocomplete und Information | Titel-Combobox per Eingabe, Pfeil-ab und Enter bedient; AX-Tree und Attribute geprüft. Info-Button per nativer Enter-Sequenz aktiviert. | Listbox enthielt 14 benannte Optionen; `aria-expanded`, `aria-activedescendant` und `aria-selected` folgten der Bedienung, Enter übernahm `DDr.` und schloss die Liste. Der Info-Button besitzt einen eindeutigen zugänglichen Namen und Enter öffnete das zugehörige Modal. Die Escape-Schließung ließ sich in der verwendeten synthetischen CDP-Sequenz nicht belastbar bestätigen und wird nicht als bestanden gewertet. | Teilweise getestet |
| Rollen, Lebensstatus und Record-Viewer | Verstorbenen und lebenden Viewer getrennt aus berechtigtem Zustand hergestellt; mehrfach `verstorben → lebend → verstorben` und Owner/Viewer gewechselt. Sichtbare Abschnitte, Controls, Aktionen, Disabled-/Hidden-/Inert-Zustände und `validateForm()` gemessen. | Verstorben sichtbar: `userrolle`, `anzeigename`, `meta`. Lebend zusätzlich `identitaet` mit ausschließlich disabled Vorname/Nachname und `quellenangaben`. Keine Viewer-Schreibaktion, kein fokussierbares verborgenes Control; Kommentar-, Anmerkungs- und Quellenmodal inert; Validierung `true`. Rückkehr zum DB-Owner stellte alle Identitätsfelder und Aktionen her. Record-Owner blieb wie zuvor editierbar und damit weiterhin abweichend zu seiner Beschreibung; Record-Editor behielt seine bestehende `disabled-section`. | Bestanden, bekannte ROLE-02-Abweichung unverändert |
| Export und mehrfacher Reset | Berechtigten Exporthandler mit Blob-/Download-Stub ausgeführt; anschließend zweimal nach Änderungen und Rollenwechsel tatsächlich neu geladen und erneut hinzugefügt. | Export erzeugte `person_…json`, widerrief die Blob-URL und enthielt `Lovelace` sowie exakt die zwei verbliebenen Varianten. Beide Resets stellten `kurator`, `verstorben`, Ferdinand/Hochstetter, Geburt/Tod und die drei Demo-Varianten wieder her, entfernten Fehler und Sichtbarkeitsreste. Nach zwei Resets fügte ein Klick exakt eine Zeile hinzu; kein doppelter Handler. Eine globale Speichern-Funktion besitzt das clientseitige Mockup nicht. | Bestanden |
| Statische Prüfungen und Browserfehler | `node --check` für `form.js`, `validation.js`, `edtf-component.js`, `autocomplete-data.js`, `theme.js`; `xmllint --html --noout index.html`; Error-/Unhandled-Rejection-Capture im Browser. | Alle JavaScript-Syntaxprüfungen bestanden; während der Phase-3.2-Interaktionen keine JavaScript-Ausnahme. `xmllint` endete mit Exit 0 und meldete weiterhin die bekannten HTML4-Modus-Warnungen zu HTML5-Elementen, unmaskierten Ampersands, Inline-Script und zwei Record-History-Listenschlüssen; keine dieser fremden Stellen wurde geändert. | Bestanden; HTML-Parser-Gesamtlauf teilweise getestet |

### Abdeckungsmatrix der Identitäts-Nachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Struktur, Field-Anatomie und Accessibility Tree | 1 | 1 | 0 | 0 | 0 | 0 |
| Responsive Layout, Langwerte, Hell-/Dunkelmodus | 1 | 1 | 0 | 0 | 0 | 0 |
| Datenbindung, Radio- und Fehlerzustände | 1 | 1 | 0 | 0 | 0 | 0 |
| Namensvarianten 0/1/n, Fokus und Export | 1 | 1 | 0 | 0 | 0 | 0 |
| Titel-Autocomplete und Informationsmodal | 1 | 0 | 0 | 1 | 0 | 0 |
| Rollen, Lebensstatus und vollständiger Record-Viewer | 1 | 1 | 0 | 0 | 0 | 0 |
| Mehrfacher Reset und Handlerstabilität | 1 | 1 | 0 | 0 | 0 | 0 |
| JavaScript-Syntax und Browserfehler | 1 | 1 | 0 | 0 | 0 | 0 |
| Gesamte HTML-Parserprüfung | 1 | 0 | 0 | 1 | 0 | 0 |
| **Identitäts-Nachprüfung gesamt** | **9** | **7** | **0** | **2** | **0** | **0** |

## Zusatzprüfung – Favoritenfunktion (01.08.2026)

Testdatum: 01.08.2026
Umgebung: Chromium 150.0.7871.181 Headless über DevTools gegen lokalen
HTTP-Server `http://127.0.0.1:8767`; `localStorage`-Zustände, Reload,
Rollen-/Lebensstatuswechsel, Collapse und Theme-Umschaltung im tatsächlich
gerenderten Formular ausgeführt. JavaScript-Syntax zusätzlich mit
`node --check form.js`, Diff-Hygiene mit `git diff --check`.

| ID | Methode / Nachweis | Tatsächliches Ergebnis | Status |
| --- | --- | --- | --- |
| FAV-01 | CDP-Browserlauf im frischen Profil ohne gespeicherte Favoriten. Reihenfolge der Top-Level-Sektionen und Sidebar-Links aus dem DOM gelesen; Anzahl der Favoriten-Buttons sowie Ausschluss von `#userrolle`, `#lebensstatus` und `#anzeigename` geprüft. | Formular startete in der ursprünglichen Reihenfolge `lebensstatus`, `anzeigename`, `identitaet`, `normdaten`, `lebensdaten`, `taetigkeiten`, `orte`, `kontakt`, `quellenangaben`, `meta`, `record_history`, `import`; die Sidebar entsprach `userrolle` plus derselben Reihenfolge. Es wurden genau 10 Favoriten-Buttons erzeugt; `#userrolle`, `#lebensstatus` und `#anzeigename` erhielten keinen Button. | Bestanden |
| FAV-02 | Zwei Favoriten (`orte`, danach `identitaet`) per Buttonklick gesetzt; anschließend Reihenfolge von Formular und Navigation aus dem DOM gelesen. | `lebensstatus` und `anzeigename` blieben fest auf Position 1 und 2. Darunter war die sichtbare Reihenfolge nach zwei Favoriten stabil `identitaet`, `orte`, danach alle übrigen favorisierbaren Sektionen in ihrer ursprünglichen Reihenfolge. Die Klickreihenfolge beeinflusste die Sortierung nicht. | Bestanden |
| FAV-03 | Reload mit vorhandenem Favoritenstatus; anschließend absichtlich ausgeschlossene ID `anzeigename` in `localStorage` injiziert und erneut geladen. | Nach Reload blieben `lebensstatus` und `anzeigename` weiterhin oben; `orte` blieb der erste echte Favorit. Der persistierte Speicherwert wurde beim Laden auf zulässige IDs bereinigt und enthielt danach nur noch `["orte"]`. Mit defektem oder ausgeschlossenen Storage-Inhalt blieb die Seite fehlerfrei. | Bestanden |
| FAV-04 | Nach gesetztem Favoriten Wechsel `verstorben -> lebend` mit bestätigtem Dialog-Stub, dann Wechsel zu Record-Viewer und zurück zu DB-Owner; zusätzlich Collapse von `identitaet`, Nav-Reihenfolge, Theme-Umschaltung und Browser-Log geprüft. | Der Favorit blieb über Lebensstatus-, Rollen- und Viewer-Wechsel erhalten. Im lebenden Viewer blieben nur `anzeigename`, `identitaet`, `quellenangaben` und `meta` sichtbar; die Sidebar zeigte exakt dieselbe Reihenfolge und blendete verborgene Sektionen weiter aus. Collapse von `identitaet` funktionierte weiterhin einschließlich der aktualisierten `aria-label`. Im Dunkelmodus blieb der aktive Stern visuell markiert; der Browserlauf protokollierte `0` Fehler auf Log-Level `error`. | Bestanden |
| FAV-05 | Zugänglichkeit per CDP geprüft: Nichtvorhandensein eines Sterns in `lebensstatus` und `anzeigename`; zugänglicher Name eines tatsächlichen Favoriten-Buttons aus dem Sektionstitel gelesen; `Tab` bis zum Favoriten-Button, Aktivierung per `Enter`; zweite Aktivierung per Leertaste nach expliziter Fokussetzung auf denselben Button; `aria-pressed` und `aria-hidden` kontrolliert. | `lebensstatus` und `anzeigename` waren nicht fokussierbar als Favoriten, weil dort keine Stern-Buttons erzeugt wurden. Ein realer Favoriten-Button war per `Tab` erreichbar, reagierte auf `Enter` und `Space`; `aria-label`, `title` und `aria-pressed` wurden zustandsabhängig aktualisiert. Das Icon blieb mit `aria-hidden="true"` aus dem Screenreader-Namen ausgeschlossen. | Bestanden |

### Abdeckungsmatrix der Favoriten-Nachprüfung

| Bereich | Gesamt | Bestanden | Fehlgeschlagen | Teilweise getestet | Blockiert | Nicht getestet |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Initialisierung, Standardreihenfolge und Button-Injektion | 1 | 1 | 0 | 0 | 0 | 0 |
| Stabile Sortierung und Entfernen | 1 | 1 | 0 | 0 | 0 | 0 |
| Persistenz und fehlerhafte Speicherung | 1 | 1 | 0 | 0 | 0 | 0 |
| Rollen-/Lebensstatuswechsel, Navigation, Collapse und Theme | 1 | 1 | 0 | 0 | 0 | 0 |
| Tastatur und Accessibility-Attribute | 1 | 1 | 0 | 0 | 0 | 0 |
| **Favoriten-Nachprüfung gesamt** | **5** | **5** | **0** | **0** | **0** | **0** |

## Historische Ausgangsbefunde und heutige Einordnung

Diese Übersicht ersetzt nicht die ursprünglichen Ergebnisfelder. Sie ordnet den
früheren Schlussabschnitt lediglich anhand der bereits dokumentierten späteren
Nachweise ein.

| Historischer Befund | Ursprünglicher Nachweis | Aktuelle Einordnung | Späterer Nachweis |
| --- | --- | --- | --- |
| Reset stellte Rolle, Lebensstatus und Ausgangsdaten nicht wieder her. | P1-RESET-01, Baseline 31.07.2026: Rolle und Lebensstatus nach Reset `null`. | **Behoben** | Phase-1-Nachprüfung P1-RESET-01/P1-RESET-02; Phase-2-Aktionsnachprüfung und Lebensdaten-Nachprüfung mit jeweils zweimaligem Reset auf `kurator`/`verstorben` ohne Daten- oder Handlerreste. |
| Record-Owner-Beschreibung und tatsächliche Sperren stimmten nicht überein. | ROLE-02, Chromium-Smoke/Audit 31.07.2026. | **Offen** | ROLE-02 wurde am 01.08.2026 erneut als abweichend bestätigt und steht weiterhin auf `Fehlgeschlagen`. |
| Einzelne dynamische Papierkorb-Schaltflächen hatten keinen zugänglichen Namen. | LIST-06 und P1-ICON-01, Chromium-Audit 31.07.2026. | **Status zu verifizieren** | Phase-1-/Phase-2-AX-Tree-Nachweise fanden aussagekräftige dynamische Namen; die dokumentierte vollständige Screenreader- und manuelle Tastaturprüfung fehlt weiterhin. |
| Autocomplete besaß keine vollständige Combobox-/Listbox-Semantik. | KEY-06, Quellcodeprüfung 31.07.2026. | **Teilweise behoben** | Phase 3.2 belegt die vollständige Semantik und Tastaturauswahl für die beiden Identitäts-Titelfelder. Die übrigen Autocomplete-Bereiche bleiben bis Phase 7 offen. |
| Ein globaler konsistenter `:focus-visible`-Standard fehlte. | P2-FOCUS-01-Baseline. | **Status zu verifizieren** | Globale Regel, Forced-Colors-Fallback und sichtbare Fokuszustände wurden per Computed Style/CDP belegt; ein vollständiger manueller Tastaturlauf über Button, Eingabe, Link und Modale fehlt. |
| Bei 375px bestand globaler horizontaler Überlauf. | Ursprünglicher RESP-01-Befund. | **Behoben** | Phase-2-Viewportläufe, Aktions-, Sidebar- und Lebensdaten-Nachprüfungen maßen bei 375px und den übrigen dokumentierten Breiten jeweils `scrollWidth === clientWidth` beziehungsweise `0px` Überlauf. Der separate Extremwertfall RESP-04 bleibt nicht getestet. |
| Abhängigkeiten hatten keinen lokal geprüften Ausfallpfad. | ENV-03/RESP-05. | **Nicht getestet** | Keine dokumentierte gezielte Blockade von Bootstrap, Icons oder EDTF; kein lokaler Asset-Fallback vorhanden. |
| Es gab keine automatisierte Testinfrastruktur. | Phase-0-Baseline. | **Offen** | Auch die späteren Abschlussprüfungen dokumentieren keine Paket- oder Repository-Testinfrastruktur. |
| Rollensteuerung war ausschließlich clientseitig. | VIEW-06, Quellcodeprüfung. | **Offen** | Verbergen, `disabled` und `inert` wurden regressionsgeprüft, ersetzen aber weiterhin keine serverseitige Autorisierung. |

## Inzwischen behoben

Die folgenden historischen Defekte besitzen einen vollständigen späteren
Nachweis. Ihr damaliger Status in den chronologischen Testfällen bleibt
unverändert sichtbar:

- **Alert-Klasse – Behoben:** P1-ALERT-01 dokumentiert nach der fehlerhaften
  Baseline-Klasse die gültige `alert-secondary`-Darstellung in Hell und Dunkel.
- **ORCID-Ausgabe – Behoben:** P1-ORCID-01 belegt vorhandenen, geänderten und
  leeren Wert, korrektes Linkziel, Reset und das Fehlen von Template-Text.
- **Englische UI-Beschriftungen – Behoben:** P1-I18N-01 bestätigt die
  dokumentierten deutschen Zieltexte im Quelltext und Chromium-DOM.
- **Buttonkontraste – Behoben:** P1-CONTRAST-01/-02 belegen rechnerisch
  ausreichende Kontraste für die zuvor fehlgeschlagenen opaken Farbkombinationen.
- **Einmaliger und mehrfacher Reset – Behoben:** P1-RESET-01/-02 sowie die
  späteren Aktions- und Lebensdaten-Nachprüfungen bestätigen Ausgangsrolle,
  Lebensstatus, Daten, dynamische Listen, Validierungszustand und das Ausbleiben
  doppelter Handler nach wiederholtem Reset.
- **Globaler Überlauf bei 375px – Behoben:** Die späteren globalen
  Scrollbreitenmessungen widerlegen den ursprünglichen RESP-01-Befund für die
  geprüften Demo-Daten.
- **Unerreichbare Container-Query und überbreite Sidebar – Behoben:** RESP-03
  sowie die Seitenlayout-/Sidebar-Nachprüfungen belegen erreichbare
  Containerzustände, 24px Abstand und kontrollierten einspaltigen Umbruch.

## Weiterhin offen

| Befund | Aktueller Status | Beleg und verbleibender Umfang |
| --- | --- | --- |
| Record-Owner-Soll gegenüber tatsächlicher Sperrlogik | **Offen** | ROLE-02 bleibt `Fehlgeschlagen`; keine spätere Korrektur dokumentiert. |
| Ausschließlich clientseitige Rollensteuerung | **Offen** | VIEW-06; produktive Autorisierung für Abruf, Speicherung und Export muss serverseitig erfolgen. |
| Autocomplete außerhalb der Identitäts-Titelfelder ohne vollständige WAI-ARIA-Combobox-/Listbox-Semantik | **Offen** | Phase 3.2 belegt das Muster nur für Standes-/Amtstitel und akademischen Titel; die übrigen Autocomplete-Bereiche sind erst für Phase 7 vorgesehen. |
| 404 für `site.webmanifest`, `favicon.ico`, `favicon.svg` und `favicon-96x96.png` | **Offen** | Lebensdaten-Nachprüfung: weiterhin in der Browserkonsole reproduziert; keine Änderung im dokumentierten Scope. |
| HTML-Parserwarnungen | **Offen** | Aktions- und Lebensdaten-Nachprüfungen dokumentieren weiterhin HTML5-/Ampersand-/Inline-Script- und Record-History-Listenwarnungen von `xmllint --html`. |
| Keine automatisierte Paket-/Repository-Testinfrastruktur | **Offen** | In allen späteren Abschlussprüfungen erneut dokumentiert. |
| Gezielter CDN-/Abhängigkeitsausfall | **Nicht getestet** | ENV-03 und RESP-05 wurden nicht mit Netzwerkblockade ausgeführt. |
| Forced-Colors-Gesamtlauf | **Nicht getestet** | THEME-05 ist nicht ausgeführt; P2-THEME-01 belegt nur CSS-Regeln/Computed Styles und bleibt teilweise getestet. |
| Cross-Browser-Kernregression | **Teilweise getestet** | RESP-06: Chromium ausgeführt; Firefox-Lauf scheiterte am belegten Profil, Safari war in der Linux-Umgebung nicht verfügbar. |
| Vollständiger manueller Tastatur- und Screenreaderlauf | **Teilweise getestet** | Automatisierte CDP-Tab-/Enter-/Escape- und AX-Tree-Prüfungen sind dokumentiert, ersetzen aber nicht die verlangte manuelle Prüfung über alle Controls und Rollen. |
| Lange Extremwerte in Orten, IDs und EDTF-Interpretationen | **Nicht getestet** | RESP-04 wurde nicht mit den vorgesehenen Extremwerten ausgeführt. |
| Persistenz neuer Anmerkungen und Kommentare | **Teilweise getestet** | Der clientseitige Mock besitzt dafür keine Fachlogik; die Aktionsnachprüfung dokumentiert `3→3` trotz „Speichern“. |

## Status noch zu verifizieren

- **Dynamische Icon-Buttons:** Accessibility Tree und dynamische wertbezogene
  Namen liefern positive Nachweise. Weil P1-ICON-01/KEY-08 den vollständigen
  Screenreader- und manuellen Tastaturumfang ausdrücklich offenlassen, wird der
  historische A11Y-01-Befund nicht pauschal als behoben gewertet.
- **Globaler Fokusstandard:** Die CSS-Regel und einzelne tatsächliche
  CDP-Fokusfolgen sind belegt. THEME-04, KEY-01 bis KEY-05 und KEY-07 enthalten
  jedoch keinen vollständigen manuellen Lauf über die gesamte Oberfläche und
  alle geforderten Zustände.
- **Lebensstatuswechsel im Viewer:** STATE-03 belegt die Zielmengen und Inertheit
  mit Test-Stub; die native Bestätigung wurde in diesem Lauf nicht vollständig
  ausgeführt. Der Einzelfall bleibt deshalb `Teilweise getestet`, obwohl spätere
  getrennte Viewerzustände bestanden haben.
- **Theme-Persistenz:** DATA-05 belegt Umschaltung und Reset, aber keinen
  getrennten Browser-Neustart; der Persistenzumfang bleibt teilweise getestet.

## Chronologische Testläufe und ursprüngliche Ergebnisse

Die Reihenfolge und die damaligen Bewertungen bleiben in den vorstehenden
Abschnitten erhalten:

1. Phase-0-Baseline und Chromium-Smoke/Audit vom 31.07.2026;
2. Phase-1-Nachprüfung vom 01.08.2026;
3. Phase-2-Nachprüfung und Layout-/Strukturkorrekturen vom 01.08.2026;
4. Aktions-, Seitenlayout- und Sidebar-Nachprüfungen vom 01.08.2026;
5. Lebensdaten-Nachprüfung vom 01.08.2026.
6. Identitäts-Nachprüfung als zweiter Komponentenpilot vom 01.08.2026.
7. Favoriten-Nachprüfung für Formularsektionen vom 01.08.2026.

Ein früheres `Fehlgeschlagen`, `Teilweise getestet` oder `Nicht getestet` wird
nicht rückwirkend geändert. „Behoben“ und „Status zu verifizieren“ sind
laufübergreifende Einordnungen und verweisen auf die späteren Nachweise.

## Verbleibende Prüf- und Dokumentationslücken

Vor weiteren Änderungen an Rollen, EDTF, dynamischen Listen, Validierung,
Theme oder responsivem Layout sind mindestens die jeweils betroffenen offenen
Testfälle nachzuholen. Besonders ausstehend sind Forced Colors,
Cross-Browser-Kernfälle, CDN-Ausfall, lange Extremwerte sowie ein vollständiger
manueller Tastatur- und Screenreaderlauf. Die Record-Viewer-Rechte bleiben
verbindlich; ihre clientseitige Umsetzung ist weiterhin keine produktive
Zugriffskontrolle.
