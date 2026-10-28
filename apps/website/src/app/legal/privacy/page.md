# Datenschutzerklärung

Stand: 17. Oktober 2026

## 1. Verantwortlicher und Geltungsbereich

DDFDB unter **www.ddfdb.de** ist ein unentgeltliches, nicht kommerzielles Hobbyprojekt von **Leif Arriens**. Diese Erklärung beschreibt die Verarbeitung personenbezogener Daten auf der Website und über die von ihr bereitgestellten Kontoschnittstellen.

Verantwortlich ist:

- **Name:** Leif Arriens
- **E-Mail:** [contact@leifarriens.dev](mailto:contact@leifarriens.dev)
- **Postanschrift:** siehe [Impressum](https://leifarriens.dev/legal). Die dort angegebenen Kontaktdaten gelten auch für DDFDB.

Wenn Sie dasselbe Konto in Website und DDFDB-App verwenden, greifen beide auf dieselben Kontodaten und persönlichen Folgenlisten zu. App-spezifische Verarbeitungen auf Ihrem Mobilgerät sind nicht Gegenstand dieser Erklärung.

## 2. Website und Hosting

Die Website wird bei **Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA**, im Tarif Hobby gehostet. Beim Aufruf werden technische Daten verarbeitet, insbesondere IP-Adresse, Zeitpunkt, angeforderte Adresse, HTTP-Status sowie vom Browser übermittelte Informationen wie Browsertyp, Betriebssystem und gegebenenfalls die zuvor besuchte Seite (Referrer). Suchbegriffe und Filter können Bestandteil der Adresse sein und dadurch auch im Browserverlauf oder in geteilten Links erscheinen.

Diese Daten dienen der Auslieferung der Website, der Fehlerbehebung und der Abwehr von Missbrauch und Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse ist der sichere und zuverlässige Betrieb des Angebots.

**Speicherdauer:** Die für mich zugänglichen [Runtime Logs](https://vercel.com/docs/logs/runtime) werden im Hobby-Tarif für **eine Stunde** vorgehalten. Dies ist keine Löschfrist für sämtliche internen Betriebs- und Sicherheitsdaten von Vercel. Für diese richtet sich die Aufbewahrung nach dem jeweiligen Betriebs-, Sicherheits- oder gesetzlichen Zweck; nähere Angaben enthält [Vercels Datenschutzerklärung](https://vercel.com/legal/privacy-notice).

## 3. Freiwilliges Benutzerkonto

### Anmeldung per E-Mail-Code

Das öffentliche Folgenarchiv können Sie ohne Konto nutzen. Für persönliche Merklisten, Gehört-Markierungen und Bewertungen benötigen Sie ein Konto. Dazu geben Sie Ihre E-Mail-Adresse an und bestätigen einen sechsstelligen Einmalcode. Bei der ersten erfolgreichen Anmeldung wird das Konto erstellt. Ein Passwort oder eine Anmeldung über soziale Netzwerke ist nicht erforderlich.

Gespeichert werden Ihre interne Benutzerkennung, E-Mail-Adresse, ein aus dem Teil vor dem `@` abgeleiteter Anzeigename, der Status der E-Mail-Verifizierung und die Erstellungs- und Aktualisierungszeitpunkte. Die Anmeldung erfolgt mit **Better Auth**, einer auf dem DDFDB-Server betriebenen Software, nicht über einen externen Anmeldedienst.

Für die Code-Prüfung werden ein Ihrer E-Mail-Adresse zugeordneter Verifikationsdatensatz mit verschlüsseltem Code, Prüfversuchen und Zeitpunkten gespeichert. Codes gelten **fünf Minuten** und können nach erfolgreicher Bestätigung nicht erneut verwendet werden. Code-Anforderungen und Prüfversuche sind zum Schutz vor Missbrauch begrenzt.

Die Anmelde-E-Mails werden über **Resend (Plus Five Five, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA)** versandt. Resend verarbeitet Empfänger- und Absenderadresse, Betreff, Nachrichteninhalt einschließlich Code und technische Zustelldaten. Ihr eigener E-Mail-Anbieter verarbeitet die empfangene Nachricht im Rahmen Ihres E-Mail-Dienstes. Es werden keine Newsletter versandt.

Rechtsgrundlage für Konto, Code-Prüfung und E-Mail-Versand ist Art. 6 Abs. 1 lit. b DSGVO zur Bereitstellung der gewünschten Kontofunktionen. Die Missbrauchsabwehr beruht auf Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse ist der Schutz des Anmeldeverfahrens. Die Nutzung eines Kontos ist freiwillig; ohne E-Mail-Adresse und Code-Bestätigung stehen die Kontofunktionen nicht zur Verfügung.

**Speicherdauer:** Bestätigte Codes werden aus der Verifikation entfernt. Abgelaufene Verifikationsdatensätze werden bei späteren Verifikationsabfragen bereinigt, nicht durch einen zeitgesteuerten Löschjob genau nach fünf Minuten. Resend bewahrt E-Mail-Inhalte, Metadaten, Zustellereignisse und Protokolle laut seinen [Aufbewahrungsregeln](https://resend.com/docs/knowledge-base/account-quotas-and-limits#data-retention) **30 Tage** auf.

### Sitzungen und Cookies

Nach der Anmeldung werden Sitzungstoken, interne Kennung, Kontozuordnung und Erstellungs-, Aktualisierungs- und Ablaufzeitpunkte gespeichert, außerdem je nach Anfrage IP-Adresse und Browserinformationen (User-Agent). Die reguläre Sitzungsdauer beträgt **sieben Tage** und kann bei weiterer Nutzung verlängert werden. Beim Abmelden wird die aktuelle Sitzung beendet. Abgelaufene Sitzungsdatensätze werden nicht allein durch Zeitablauf sofort gelöscht; spätestens bei der Kontolöschung werden die zugeordneten Sitzungen aus der aktiven Datenbank entfernt.

Ein technisch erforderliches Cookie enthält das signierte Sitzungstoken. Es heißt `better-auth.session_token`, bei HTTPS gegebenenfalls mit dem Präfix `__Secure-`. Seine reguläre Laufzeit beträgt sieben Tage und kann mit der Sitzung erneuert werden. Beim Abmelden wird es entfernt. Sie können Cookies im Browser löschen oder blockieren; eine dauerhafte Anmeldung ist dann nicht möglich.

Die Speicherung und das Auslesen des Cookies erfolgen nach § 25 Abs. 2 Nr. 2 TDDDG für die ausdrücklich gewünschte Anmeldefunktion. Die anschließende Sitzungsverwaltung beruht auf Art. 6 Abs. 1 lit. b DSGVO; die Verarbeitung technischer Daten zur Missbrauchsabwehr auf Art. 6 Abs. 1 lit. f DSGVO zum Schutz von Konten und Infrastruktur.

Persönliche Folgenlisten werden nicht zusätzlich dauerhaft im Local Storage oder Session Storage des Browsers gespeichert. **Webanalyse- und Trackingdienste werden nicht eingesetzt**, auch nicht Vercel Web Analytics. Für Anmelde-E-Mails wird kein Öffnungs- oder Linktracking eingesetzt.

## 4. Persönliche Folgenlisten und Bewertungen

Bei Nutzung dieser Funktionen werden mit Ihrer Benutzerkennung gespeichert:

- **Merkliste:** Folgenkennung und Zeitpunkt der Speicherung;
- **Gehört-Markierungen:** Folgenkennung und Zeitpunkt der Markierung;
- **Bewertungen:** Folgenkennung, Bewertung sowie Erstellungs- und Aktualisierungszeitpunkt.

Die Daten dienen der Bereitstellung Ihrer persönlichen Funktionen in Website und App. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Merklisten und Gehört-Markierungen sind nicht öffentlich. Aus Bewertungen werden öffentliche Community-Wertungen berechnet, insbesondere Durchschnitt und Anzahl; Ihr Name und Ihre E-Mail-Adresse werden dabei nicht veröffentlicht.

Einträge bleiben gespeichert, bis Sie sie über die jeweiligen Funktionen entfernen oder Ihr Konto löschen. Dabei werden die Datensätze aus der aktiven Datenbank entfernt.

## 5. Datenbank und Kontolöschung

Konten, Sitzungen, Verifikationsdatensätze und persönliche Folgendaten werden bei **Neon**, einem Datenbankdienst der Databricks-Gruppe, gespeichert. Der Zugriff erfolgt über den DDFDB-Server, nicht unmittelbar aus Ihrem Browser. Neon verarbeitet die Daten zur Bereitstellung und Absicherung der Datenbank; Zwecke und Rechtsgrundlagen entsprechen den in den Abschnitten 3 und 4 beschriebenen Funktionen. Weitere Informationen enthalten die [Neon-Vertragsbedingungen](https://neon.com/platform-terms) und die [Datenschutzerklärung](https://neon.com/privacy-policy).

Kontodaten bleiben für die Dauer des Kontos gespeichert. Eine automatische Löschung wegen Inaktivität ist nicht eingerichtet. Unter [Kontoeinstellungen](/profile/account) können Sie Ihr Konto über „Konto löschen“ selbst löschen. Dafür ist eine kürzlich erfolgte Anmeldung erforderlich; melden Sie sich bei Bedarf ab und erneut an. Alternativ können Sie die Löschung per E-Mail anfragen.

Bei erfolgreicher Kontolöschung werden das Konto, seine Sitzungen, Merklisten, Gehört-Markierungen und Bewertungen aus der aktiven Datenbank entfernt. Verifikationsdatensätze und bereits versandte E-Mails sind davon unabhängig; für sie gelten die in Abschnitt 3 genannten Abläufe und Fristen.

Neon wird im Free-Tarif mit den Standardeinstellungen genutzt. Das [Wiederherstellungsfenster](https://neon.com/docs/introduction/restore-window) beträgt dort **sechs Stunden**, begrenzt auf **1 GB Änderungshistorie**. Gelöschte Daten können während dieses Fensters noch in der Änderungshistorie enthalten sein; ältere Änderungsprotokolle außerhalb des Fensters werden automatisch entfernt. Dies ist keine allgemeine Löschfrist für sämtliche internen Betriebsdaten des Anbieters.

Eine darüber hinausgehende Speicherung erfolgt nur, soweit dafür ein fortbestehender Zweck und eine Rechtsgrundlage bestehen, etwa eine gesetzliche Aufbewahrungspflicht oder die notwendige Durchsetzung oder Verteidigung von Rechtsansprüchen.

## 6. Dienstleister und Übermittlungen in Drittländer

Empfänger personenbezogener Daten sind im beschriebenen Umfang **Vercel**, **Neon / Databricks** und **Resend** sowie deren eingesetzte Infrastruktur- und Supportdienstleister. Dabei können Daten auch außerhalb der EU bzw. des EWR verarbeitet werden, insbesondere in den **USA**. Ein Datenbankstandort in der EU schließt solche Zugriffe nicht aus.

Vercel erklärt in seiner [Datenschutzerklärung](https://vercel.com/legal/privacy-notice#data-privacy-framework), am **EU-US Data Privacy Framework** teilzunehmen. Für Übermittlungen, die von dieser Zertifizierung erfasst sind, besteht ein Angemessenheitsbeschluss nach Art. 45 DSGVO. Informationen zur Zertifizierung bietet die [Teilnehmerliste des Data Privacy Framework](https://www.dataprivacyframework.gov/participant/Vercel).

Die [Neon-Vertragsbedingungen](https://neon.com/platform-terms) beziehen das [Databricks-Vertragswerk](https://www.databricks.com/legal/mcsa) einschließlich der [Auftragsverarbeitungsvereinbarung](https://www.databricks.com/legal/dpa) ein. Auch die [Resend-Auftragsverarbeitungsvereinbarung](https://resend.com/legal/dpa) ist nach ihrem Wortlaut Bestandteil der Nutzungsvereinbarung. Diese Vereinbarungen sehen für entsprechende Drittlandübermittlungen insbesondere **EU-Standardvertragsklauseln** als Garantien nach Art. 46 DSGVO vor. Die Regelungen sind über die genannten Links zugänglich; weitere Informationen und gegebenenfalls Kopien der einschlägigen Garantien können Sie über die Kontaktadresse in Abschnitt 1 anfordern.

## 7. Folgeninformationen, Bilder und externe Links

Öffentliche Folgeninformationen stammen aus dem projektinternen Archiv-Dienst, der Metadaten von **dreimetadaten.de** aufbereitet. Die Website ruft ihn serverseitig ab, ohne Ihre Anmeldecookies oder Kontodaten weiterzuleiten.

Cover und Hintergrundbilder stammen insbesondere von dreimetadaten.de, Sony Music und Apple. Sie werden über die Bildoptimierung des Website-Servers ausgeliefert; allein durch diese Bildanzeige baut Ihr Browser keine direkte Verbindung zur ursprünglichen Bildquelle auf.

Streamingdienste und weitere externe Angebote sind lediglich verlinkt, nicht als Player eingebettet. Wenn Sie einen Link öffnen, gelten die Datenschutzinformationen des jeweiligen Anbieters. DDFDB übermittelt dabei keine Kontodaten oder persönlichen Folgenlisten.

## 8. Kontakt und Ihre Rechte

Wenn Sie mich kontaktieren, verarbeite ich Ihre Kontaktdaten, Nachricht und gegebenenfalls erforderliche Nachweise zur Bearbeitung. Bei E-Mails verarbeiten auch die beteiligten E-Mail-Dienstleister die Nachricht. Rechtsgrundlage ist bei Datenschutzanfragen Art. 6 Abs. 1 lit. c in Verbindung mit Art. 12 bis 22 DSGVO, bei sonstigen Anfragen Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse ist deren Beantwortung. Korrespondenz wird so lange aufbewahrt, wie es für die Bearbeitung und einen erforderlichen Nachweis der Erledigung notwendig ist oder gesetzliche Pflichten bestehen.

Sie haben nach Maßgabe der gesetzlichen Voraussetzungen das Recht auf **Auskunft und eine Datenkopie** (Art. 15 DSGVO), **Berichtigung** (Art. 16), **Löschung** (Art. 17), **Einschränkung der Verarbeitung** (Art. 18) und **Datenübertragbarkeit** (Art. 20). Soweit eine Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit für die Zukunft widerrufen, ohne dass die Rechtmäßigkeit der bisherigen Verarbeitung berührt wird (Art. 7 Abs. 3 DSGVO).

**Widerspruch:** Gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO können Sie aus Gründen Ihrer besonderen Situation jederzeit widersprechen (Art. 21 Abs. 1 DSGVO). Die Verarbeitung wird dann beendet, sofern keine zwingenden schutzwürdigen Gründe überwiegen oder sie zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.

Zur Ausübung Ihrer Rechte genügt eine Nachricht an die Kontaktadresse in Abschnitt 1. Bei berechtigten Zweifeln an Ihrer Identität können erforderliche zusätzliche Angaben zur Identifizierung angefordert werden.

Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere am Ort Ihres gewöhnlichen Aufenthalts, Ihres Arbeitsplatzes oder des vermuteten Verstoßes. Die BfDI stellt eine [Übersicht der deutschen Aufsichtsbehörden](https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html) bereit.

Eine automatisierte Entscheidungsfindung einschließlich Profiling mit rechtlicher oder ähnlich erheblicher Wirkung findet nicht statt.
