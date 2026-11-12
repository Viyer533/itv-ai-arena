# ITV AI Arena - Vercel edition

Post the player URL early. The page stays locked and checks `/api/status` every 10 seconds. At activity time, use `/host.html` to open the arena. Waiting players unlock automatically.

## Vercel environment variables
Add under Project Settings > Environment Variables, then redeploy:
- `ADMIN_KEY`: private host password
- `GAME_ID`: `ITV-AI-ARENA-NOV2026`
- `PA_STATUS_URL`: flow returning `{ "enabled": false, "message": "..." }`
- `PA_CONTROL_URL`: flow updating control state
- `PA_SUBMIT_URL`: flow creating a result record
- `PA_LEADERBOARD_URL`: flow returning `{ "results": [...] }`

## Pages
- `/` player link
- `/host.html` private host controls
- `/leaderboard.html` live standings, refreshed every 5 seconds

## Shared storage recommendation
Use SharePoint lists for concurrent writes.

Control list: Title/GameId, Enabled, Message, UpdatedAt.
Results list: Title/PlayerName, GameId, SubmissionId, Score, Correct, Attempted, Total, Skipped, TimeSeconds, StartedAt, CompletedAt.

## Flow contracts
Status request: `{ "gameId":"..." }`; response: `{ "enabled":false,"message":"The arena is not open yet." }`.
Control request: `{ "gameId":"...","enabled":true }`; update the control item and respond `{ "enabled":true }`.
Submit: write the server-calculated payload to Results. Correct answers are held server-side in `lib/questions.js`.
Leaderboard response: `{ "results":[{"playerName":"A","score":1900,"correct":14,"attempted":15,"timeSeconds":151}] }`.

## Meeting operation
1. Share `/` at the start of the meeting. It remains locked.
2. Around minute 30, open `/host.html`, enter `ADMIN_KEY`, and choose Open Arena.
3. Keep the arena open through the 3-minute game and score-submission window.
4. Choose Close Arena to block new starts and submissions.
5. Present `/leaderboard.html`.
