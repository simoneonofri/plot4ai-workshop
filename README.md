# PLOT4ai Workshop

Private, independent digital adaptation of the PLOT4ai cards, with a searchable card browser and a facilitated workshop table inspired by the LINDDUN GO digital tools. No build step or runtime dependencies.

## Run

Run `npm start` from this folder and open <http://127.0.0.1:4173>. Alternatively run `python3 -m http.server 4173 --bind 127.0.0.1`. Use an HTTP server rather than opening index.html directly. Routes: `#browser`, `#table`, `#about`.

Filter by category, phase, role and AI type. Filters combine with AND. Selection persists while filtering; “Select results” adds the current results and “Clear selection” clears the whole deck. Start a shuffled session, review cards, record findings, and export JSON to resume or CSV for follow-up. Review outcomes and notes save automatically in this browser. The session overview allows revisiting any card. The timer is per card and is not persisted. This is a shared-screen tool, without multiplayer synchronization.

Session files contain potentially sensitive system details. Browser storage is local to the browser and origin and can be cleared; keep JSON backups. No session content is put into URLs. No external requests are made by the app until a user follows an external reference link. No hosted deployment has been configured.

## Source and license

The 138 cards in `deck.json` are an unchanged copy of [PLOT4ai/plot4ai-library](https://github.com/PLOT4ai/plot4ai-library), commit `5f4b43e36d372ab7160e4ada7f81b4848c42056f`. The source JSON, rather than the PDF release, is authoritative for this adaptation. Eight groups retain their original colors, questions, explanations, recommendations, phases, roles, AI types and source links. Local card IDs are group ID plus one-based source position and are tied to this exact revision. Import rejects other revisions to prevent attaching notes to the wrong card.

PLOT4ai content and this adaptation are provided under **CC BY-SA 4.0**; see the full upstream `LICENSE`. Attribution: PLOT4ai contributors, [plot4.ai](https://plot4.ai/). Interface, display IDs, filtering and session functions are additions; card wording is unchanged. Markdown list markers remain visible and HTTP(S) Markdown links become clickable.

Functional references: [LINDDUN GO digital](https://downloads.linddun.org/linddun-go/digital/v241203/index.html) and [card browser](https://downloads.linddun.org/linddun-go/cardbrowser/v241203/index.html). No LINDDUN source code or assets were copied. No endorsement is implied.

## Development

`npm test` runs Node's built-in test runner against deck completeness, filters, shuffling, session import validation and CSV safety. The application uses escaped content and supports only HTTP(S) Markdown links. Imported sessions are bounded and validated before replacing the current session.

Next work: test with a facilitation group; consider authenticated hosting only when requested.
