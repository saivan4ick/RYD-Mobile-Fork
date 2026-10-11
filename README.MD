[![Mozilla downloads](https://img.shields.io/amo/users/ryd-mobile-fork?label=Firefox%20Users&style=flat&logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/ryd-mobile-fork/)
[![Commit rate](https://img.shields.io/github/commit-activity/m/saivan4ick/RYD-Mobile-Fork?label=Commits&style=flat)](https://github.com/saivan4ick/RYD-Mobile-Fork/commits/main)
[![Issues](https://img.shields.io/github/issues/saivan4ick/RYD-Mobile-Fork?style=flat&label=Issues)](https://github.com/saivan4ick/RYD-Mobile-Fork/issues)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat)](https://github.com/saivan4ick/RYD-Mobile-Fork/blob/main/LICENSE)
# RYD Mobile Fork — Return YouTube Dislike for Firefox Mobile

<p align="center">
    <b>RYD Mobile Fork is a lightweight, open-source browser extension that brings back the YouTube dislike count, specifically optimized for Firefox (including Firefox for Android).</b><br><br>
    <a href="https://returnyoutubedislike.com/">Original Return YouTube Dislike Project</a>
</p>

---

## About This Fork

This fork is designed for Firefox users—especially on **Firefox for Android**—who want a reliable, clean dislike count without bloat or broken layouts:

- **Optimized for Mobile YouTube:** Seamlessly renders dislike numbers and the rating ratio bar on `m.youtube.com` as well as the desktop site.
- **Clean & Streamlined UI:** Removed unused Patreon and GitHub OAuth login flows, account buttons, and extraneous clutter from the popup interface.
- **Enhanced Security & AMO Compliance:** Fully refactored to eliminate unsafe DOM patterns (`innerHTML`, `insertAdjacentHTML`, `new Function`), strictly following Mozilla Add-ons guidelines.
- **Official API Powered:** Communicates directly with the official public Return YouTube Dislike API to fetch statistics and register votes.

---

## The Story

On November 10th, 2021, Google [announced](https://blog.youtube/news-and-events/update-to-youtube/) that the YouTube dislike count would be removed.

Additionally, the `dislike` field in the YouTube API was [removed](https://support.google.com/youtube/thread/134791097/update-to-youtube-dislike-counts) on December 13th, 2021, making it difficult for viewers to judge the quality, accuracy, or safety of content before watching.

---

## How It Works

With dislike statistics no longer exposed by YouTube's official API, the backend service calculates dislike counts using a combination of archived stats (scraped before the API shutdown) and proportional estimates extrapolated from active extension users.

1. When you open a YouTube video, the extension sends the video ID and the visible like count to the API.
2. The server responds with the estimated dislike count, which is injected directly next to the dislike button.
3. If vote submission is enabled, your Like/Dislike interactions help refine and improve accuracy for the entire community.

---

## Privacy at a Glance

This extension does not collect or sell personal data:
- **No Third-Party Logins:** No account credentials, OAuth tokens, or subscriptions required.
- **No YouTube Personal Data:** Does not access your account name, email, watch history, comments, or private playlists.
- **Local Settings:** Preferences (number formats, theme colors, vote submission toggle) are stored locally in the browser.

---

## API Reference

The extension relies on the public Return YouTube Dislike API:
- **Base URL:** `https://returnyoutubedislikeapi.com`
- **Swagger Documentation:** [https://returnyoutubedislikeapi.com/swagger/index.html](https://returnyoutubedislikeapi.com/swagger/index.html)

### Fetching Video Stats

Example request:
`GET /votes?videoId=kxOuG8jMIgI`

```json
{
  "id": "kxOuG8jMIgI",
  "dateCreated": "2022-04-09T21:44:20.5103Z",
  "likes": 31885,
  "rawDislikes": 31946,
  "rawLikes": 457,
  "dislikes": 579721,
  "rating": 1.2085329444119253,
  "viewCount": 3762293,
  "deleted": false
}
```

---

## Credits & Acknowledgments

- **Dmitry Selivanov (Anarios)** and the [Return YouTube Dislike team](https://github.com/Anarios/return-youtube-dislike) for creating the original algorithm, backend, and extension.
- **The RYD Community** for keeping the database alive and accurate.