# AI Arena Static Edition

A custom-coded, browser-only game-show website with 15 AI This-or-That questions. The quiz, timer, navigation, scoring, and answer review run locally on each contestant's device. A lightweight external endpoint is needed only for centralized score submission and host open/close controls.

## Important architecture truth
A Teams-shareable link still requires static hosting, such as an approved GitHub Pages site, Azure Static Web Apps, Cloudflare Pages, Netlify, or another approved internal static host. Static hosting does not require a continuously running application server.

A combined leaderboard and remote host switch require a shared data destination. This package supports HTTP endpoints through `config.js`.

## Player features
- Name-only entry
- 15 questions maximum
- 3-minute overall timer by default
- Free navigation and answer changes
- Skip option
- Weighted difficulty scoring
- Local score calculation
- Submit-once result payload
- Automatic time tie-break data
- Responsive game-show interface

## Question weighting
- Easy: 75 points x 4
- Medium: 100 points x 5
- Hard: 150 points x 3
- Expert: 200 points x 2
- Boss: 300 points x 1
- Maximum: 1,950 points

Correct answers are deliberately mixed between A and B.

## Configure
Edit `config.js`:

- `durationSeconds`: total game duration, recommended 180 seconds inside a 5-minute meeting slot.
- `submitUrl`: endpoint that receives the final result JSON.
- `statusUrl`: GET endpoint returning `{ "enabled": true }` or `{ "enabled": false, "message": "Arena closed" }`.
- `hostControlUrl`: POST endpoint accepting `{ "hostKey": "...", "enabled": true|false }`.
- `hostKey`: replace the demo value.

When endpoints are blank, the package operates in local demo mode. Local host controls affect only the same browser and are not suitable for a live event.

## Result payload
The Submit button sends JSON resembling:

```json
{
  "submissionId": "uuid",
  "playerName": "Varun",
  "score": 1575,
  "correct": 12,
  "attempted": 14,
  "total": 15,
  "skipped": 1,
  "timeSeconds": 142,
  "startedAt": "ISO timestamp",
  "completedAt": "ISO timestamp",
  "finishReason": "submitted",
  "answers": []
}
```

Rank results by `score` descending, then `timeSeconds` ascending.

## Microsoft 365 result collection design
A practical M365 implementation is:

1. A Power Automate flow receives an HTTP POST from the game.
2. The flow validates required fields and rejects duplicate `submissionId` values.
3. The flow adds a row to an Excel table stored in SharePoint or OneDrive.
4. Excel formulas or Power BI rank by Score descending and TimeSeconds ascending.
5. A second flow or endpoint stores game status in a SharePoint list with columns `GameId`, `Enabled`, and `UpdatedAt`.

Caution: HTTP-trigger licensing, anonymous access, CORS, and corporate data-loss-prevention policies vary. Have the Power Platform administrator approve the flow. Do not put a privileged secret in client-side JavaScript; validate host actions server-side.

## Suggested Excel table columns
SubmissionId, PlayerName, Score, Correct, Attempted, Total, Skipped, TimeSeconds, StartedAt, CompletedAt, FinishReason, ReceivedAt

Example rank formula in an Excel table named `Results`:

`=1+COUNTIFS(Results[Score],">"&[@Score])+COUNTIFS(Results[Score],[@Score],Results[TimeSeconds],"<"&[@TimeSeconds])`

## Hosting
Upload all files in this folder to an approved static host. Share the resulting `index.html` URL in Teams. Keep `host.html` private and protected by a properly validated host-control endpoint.

## Live-event recommendation
Use a 3-minute quiz inside the 5-minute meeting slot:
- 20 seconds: instructions and link
- 3 minutes: gameplay
- 20 seconds: submit scores
- 60-80 seconds: reveal leaderboard/winner
