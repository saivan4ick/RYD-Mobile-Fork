(() => {
    var __webpack_modules__ = {
        110(module) {
            const LIKED_STATE = "LIKED_STATE";
            const DISLIKED_STATE = "DISLIKED_STATE";
            const NEUTRAL_STATE = "NEUTRAL_STATE";
            const LIKE_ACTION = "like";
            const DISLIKE_ACTION = "dislike";
            const TRANSITIONS = {
                [NEUTRAL_STATE]: {
                    [LIKE_ACTION]: {
                        nextState: LIKED_STATE,
                        value: 1,
                        likesDelta: 1,
                        dislikesDelta: 0
                    },
                    [DISLIKE_ACTION]: {
                        nextState: DISLIKED_STATE,
                        value: -1,
                        likesDelta: 0,
                        dislikesDelta: 1
                    }
                },
                [LIKED_STATE]: {
                    [LIKE_ACTION]: {
                        nextState: NEUTRAL_STATE,
                        value: 0,
                        likesDelta: -1,
                        dislikesDelta: 0
                    },
                    [DISLIKE_ACTION]: {
                        nextState: DISLIKED_STATE,
                        value: -1,
                        likesDelta: -1,
                        dislikesDelta: 1
                    }
                },
                [DISLIKED_STATE]: {
                    [LIKE_ACTION]: {
                        nextState: LIKED_STATE,
                        value: 1,
                        likesDelta: 1,
                        dislikesDelta: -1
                    },
                    [DISLIKE_ACTION]: {
                        nextState: NEUTRAL_STATE,
                        value: 0,
                        likesDelta: 0,
                        dislikesDelta: -1
                    }
                }
            };
            function resolveVoteTransition(previousState, action) {
                const transition = TRANSITIONS[previousState]?.[action];
                if (!transition) {
                    throw new TypeError(`Unsupported vote transition: ${previousState} -> ${action}`);
                }
                return {
                    ...transition
                };
            }
            function applyVoteTransitionCounts(likes, dislikes, transition) {
                if (!transition || !Number.isFinite(transition.likesDelta) || !Number.isFinite(transition.dislikesDelta)) {
                    throw new TypeError("A valid vote transition is required");
                }
                const normalizedLikes = Number.isFinite(likes) ? likes : 0;
                const normalizedDislikes = Number.isFinite(dislikes) ? dislikes : 0;
                return {
                    likes: Math.max(0, normalizedLikes + transition.likesDelta),
                    dislikes: Math.max(0, normalizedDislikes + transition.dislikesDelta)
                };
            }
            function shouldSubmitVote({disableVoteSubmission: disableVoteSubmission = false, signedOut: signedOut = false} = {}) {
                return disableVoteSubmission !== true && signedOut !== true;
            }
            module.exports = {
                DISLIKED_STATE: DISLIKED_STATE,
                DISLIKE_ACTION: DISLIKE_ACTION,
                LIKED_STATE: LIKED_STATE,
                LIKE_ACTION: LIKE_ACTION,
                NEUTRAL_STATE: NEUTRAL_STATE,
                applyVoteTransitionCounts: applyVoteTransitionCounts,
                resolveVoteTransition: resolveVoteTransition,
                shouldSubmitVote: shouldSubmitVote
            };
        }
    };
    const __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        const cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        const module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        var vote_transition_core_namespaceFn = () => __webpack_require__(110);
        const PROD_API_URL = "https://returnyoutubedislikeapi.com";
        const DEV_API_URL = PROD_API_URL;
        const runtime = typeof chrome !== "undefined" ? chrome.runtime : null;
        const manifest = typeof runtime?.getManifest === "function" ? runtime.getManifest() : null;
        const isDevelopment = !manifest || !("update_url" in manifest);
        const extensionChangelogUrl = runtime && typeof runtime.getURL === "function" ? runtime.getURL("changelog/4/changelog_4.0.html") : "https://returnyoutubedislike.com/changelog/4/changelog_4.0.html";
        const config = {
            apiUrl: isDevelopment ? DEV_API_URL : PROD_API_URL,
            voteDisabledIconName: "icon_hold128.png",
            defaultIconName: "icon128.png",
            links: {
                website: "https://returnyoutubedislike.com",
                github: "https://github.com/Anarios/return-youtube-dislike",
                discord: "https://discord.gg/mYnESY4Md5",
                donate: "https://returnyoutubedislike.com/donate",
                faq: "https://returnyoutubedislike.com/faq",
                help: "https://returnyoutubedislike.com/help",
                changelog: extensionChangelogUrl
            },
            defaultExtConfig: {
                disableVoteSubmission: false,
                disableLogging: true,
                coloredThumbs: false,
                coloredBar: false,
                colorTheme: "classic",
                numberDisplayFormat: "compactShort",
                numberDisplayReformatLikes: false,
                hidePremiumTeaser: false,
                hideClutterButtons: false
            }
        };
        function getApiUrl() {
            return config.apiUrl;
        }
        function getApiEndpoint(endpoint) {
            return `${config.apiUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
        }
        function getChangelogUrl() {
            return config.links?.changelog ?? extensionChangelogUrl;
        }
        var extConfig;
        var isMobile;
        var isShorts;
        var querySelector;
        var getVideoId;
        var querySelectorAll;
        var getShortsIdentityLinkVideoIds;
        var sharedShortsSurfaceIsReady;
        var sharedShortsNativeInventoryIsReadyForFallback;
        var actionBarHasHydratedData;
        const buttonsVideoOwnership = new WeakMap;
        const SYNTHETIC_SHORTS_DISLIKE_SELECTOR = "[data-ryd-synthetic-shorts-dislike]";
        const SHORTS_DISLIKE_ICON_PATH = "m8.482 1.5.294.005a9.01 9.01 0 013.918 1.04l.257.143.203.116c.17.097.357.16.55.185l.194.012h1.477l.115.006c.53.054.95.475 1.004 1.005l.006.114v4.499c0 .621-.504 1.125-1.125 1.125h-1.343a.75.75 0 00-.66.395l-.048.107-2.24 6.402a.75.75 0 01-.832.491l-.78-.13a3 3 0 01-2.439-3.587L7.5 11.25H4.454a2.749 2.749 0 01-2.683-2.151 2.762 2.762 0 01.479-2.237l-.016-.065A2.862 2.862 0 013 4.125v-.032c0-.227.037-.453.108-.668l.08-.211A2.816 2.816 0 015.78 1.5h2.703ZM5.78 3c-.566 0-1.069.362-1.248.9a.613.613 0 00-.031.193v.654l-.44.44c-.333.332-.47.813-.364 1.271l.015.065.157.675-.413.557a1.248 1.248 0 00.999 1.995H7.5a1.501 1.501 0 011.467 1.815L8.5 13.742a1.5 1.5 0 001.22 1.794l.157.027 2.031-5.806a2.25 2.25 0 012.124-1.507H15V4.501h-1.102a3.001 3.001 0 01-1.489-.396l-.202-.116A7.504 7.504 0 008.482 3H5.78Z";
        function hasRenderedBox(element) {
            if (!element?.isConnected || element.closest("[hidden], [aria-hidden='true'], [inert]")) {
                return false;
            }
            for (let current = element; current; current = current.parentElement) {
                const style = window.getComputedStyle(current);
                if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || Number.parseFloat(style.opacity) === 0) {
                    return false;
                }
            }
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }
        function intersectsViewport(element) {
            const rect = element.getBoundingClientRect();
            const height = innerHeight || document.documentElement.clientHeight;
            const width = innerWidth || document.documentElement.clientWidth;
            return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < height && rect.left < width;
        }
        function hasMeaningfulViewportPresence(element) {
            const rect = element?.getBoundingClientRect?.();
            if (!rect || rect.width <= 0 || rect.height <= 0) return false;
            const height = innerHeight || document.documentElement.clientHeight;
            const width = innerWidth || document.documentElement.clientWidth;
            const visibleWidth = Math.max(0, Math.min(rect.right, width) - Math.max(rect.left, 0));
            const visibleHeight = Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, 0));
            return visibleWidth * visibleHeight / (rect.width * rect.height) >= .5;
        }
        function configuredMatches(selectors) {
            const matches = [];
            for (const selector of Array.isArray(selectors) ? selectors : [ selectors ]) {
                if (selector) matches.push(...document.querySelectorAll(selector));
            }
            return matches;
        }
        function getDesktopWatchButtonCandidates() {
            return Array.from(new Set([ ...configuredMatches(extConfig.selectors.buttons.regular.desktopMenu), ...configuredMatches(extConfig.selectors.buttons.regular.desktopNoMenu) ])).filter(candidate => {
                const segmented = querySelector(extConfig.selectors.buttons.segmentedContainer, candidate);
                const like = querySelector(extConfig.selectors.buttons.likeButton.notSegmented, candidate);
                return segmented !== undefined || like !== undefined;
            });
        }
        function markButtonsForVideo(buttons, videoId) {
            if (buttons && videoId) {
                buttonsVideoOwnership.set(buttons, videoId);
            }
        }
        function getButtonsVideoOwnership(candidate) {
            return buttonsVideoOwnership.get(candidate) ?? candidate.getAttribute("video-id") ?? candidate.getAttribute("data-video-id");
        }
        function selectCurrentWatchButtons(candidates) {
            const videoId = getVideoId(window.location.href);
            return candidates.map((candidate, index) => {
                const watchRoot = candidate.closest("ytd-watch-flexy, ytd-watch-grid");
                const rootVideoId = watchRoot?.getAttribute("video-id");
                const rootMatches = Boolean(videoId && rootVideoId === videoId);
                const rootConflicts = Boolean(videoId && rootVideoId && rootVideoId !== videoId);
                const controlsVideoId = getButtonsVideoOwnership(candidate);
                const controlsMatch = Boolean(videoId && controlsVideoId === videoId);
                const controlsConflict = Boolean(videoId && controlsVideoId && controlsVideoId !== videoId);
                const rendered = hasRenderedBox(candidate);
                const inViewport = rendered && intersectsViewport(candidate);
                const usable = hasUsableButtonStructure(candidate);
                const tier = rootMatches && inViewport && !controlsConflict ? 10 : rootMatches && inViewport ? 9 : inViewport && !controlsConflict ? 8 : inViewport ? 7 : rootMatches && rendered && !controlsConflict ? 6 : rootMatches && rendered ? 5 : rendered && !controlsConflict ? 4 : rendered ? 3 : (rootMatches || controlsMatch) && !controlsConflict ? 2 : !controlsConflict ? 1 : 0;
                return {
                    candidate: candidate,
                    index: index,
                    rendered: rendered,
                    rootConflicts: rootConflicts,
                    tier: tier,
                    usable: usable
                };
            }).filter(({rendered: rendered, rootConflicts: rootConflicts, usable: usable}) => rendered && !rootConflicts && usable).sort((left, right) => right.tier - left.tier || left.index - right.index)[0]?.candidate;
        }
        function getNativeButton(buttonContainer) {
            if (!buttonContainer) return undefined;
            return querySelector(extConfig.selectors.buttons.nativeButton, buttonContainer);
        }
        function isSegmentedButtonLayout(buttons = getButtons()) {
            return Boolean(buttons && querySelector(extConfig.selectors.buttons.segmentedContainer, buttons) !== undefined);
        }
        function getShortsRenderer(buttons) {
            return buttons?.closest("ytd-reel-video-renderer, ytm-reel-video-renderer") ?? null;
        }
        function getShortsCandidateVideoIds(buttons) {
            const renderer = getShortsRenderer(buttons);
            const videoIds = new Set;
            const rendererVideoId = renderer?.getAttribute("video-id");
            if (rendererVideoId) videoIds.add(rendererVideoId);
            for (const videoId of getShortsIdentityLinkVideoIds(renderer, window.location.href)) {
                videoIds.add(videoId);
            }
            return videoIds;
        }
        function getShortsCandidateVideoId(buttons) {
            const videoIds = getShortsCandidateVideoIds(buttons);
            return videoIds.size === 1 ? videoIds.values().next().value : null;
        }
        function getShortsControlSurfaceSignature(buttons) {
            return Array.from(getShortsCandidateVideoIds(buttons)).sort().join("|") || "identityless";
        }
        function getVisibleShortsControlSurfaceCount() {
            const elements = isMobile() ? querySelectorAll(extConfig.selectors.buttons.shorts.mobile) : querySelectorAll(extConfig.selectors.buttons.shorts.desktop);
            return Array.from(elements).filter(candidate => hasRenderedBox(candidate) && hasMeaningfulViewportPresence(candidate)).length;
        }
        function shortsControlSurfaceIsReadyForMutation(buttons, currentVideoId, {allowUnhydratedFallback: allowUnhydratedFallback = false, isHydrated: isHydrated = false, isStable: isStable = false} = {}) {
            return sharedShortsSurfaceIsReady({
                allowUnhydratedFallback: allowUnhydratedFallback,
                candidateVideoIds: getShortsCandidateVideoIds(buttons),
                currentVideoId: currentVideoId,
                isConnected: buttons?.isConnected,
                isHydrated: isHydrated,
                isRendered: hasRenderedBox(buttons),
                isStable: isStable,
                isViewportIntersecting: hasMeaningfulViewportPresence(buttons),
                visibleCandidateCount: getVisibleShortsControlSurfaceCount()
            });
        }
        function shortsNativeControlInventoryIsReadyForFallback(inventory) {
            return sharedShortsNativeInventoryIsReadyForFallback(inventory, {
                getTopmostElement: typeof document.elementFromPoint === "function" ? (x, y) => document.elementFromPoint(x, y) : null,
                isMeaningfullyInViewport: hasMeaningfulViewportPresence,
                isRendered: hasRenderedBox
            });
        }
        function selectCurrentShortsButtons(elements) {
            const currentVideoId = getVideoId(window.location.href);
            const candidates = Array.from(elements).map(buttons => {
                const renderer = getShortsRenderer(buttons);
                const rendered = hasRenderedBox(buttons);
                const videoIds = getShortsCandidateVideoIds(buttons);
                return {
                    active: renderer?.hasAttribute("is-active") === true,
                    ambiguous: videoIds.size > 1,
                    buttons: buttons,
                    intersectsViewport: rendered && intersectsViewport(buttons),
                    rendered: rendered,
                    videoId: videoIds.size === 1 ? videoIds.values().next().value : null
                };
            }).filter(({rendered: rendered}) => rendered);
            const unambiguousCandidates = candidates.filter(({ambiguous: ambiguous}) => !ambiguous);
            const currentVideoCandidates = currentVideoId ? unambiguousCandidates.filter(candidate => candidate.videoId === currentVideoId) : [];
            const exactActive = currentVideoCandidates.find(({active: active}) => active);
            if (exactActive) return exactActive.buttons;
            const exactVisible = currentVideoCandidates.find(({intersectsViewport: visible}) => visible);
            if (exactVisible) return exactVisible.buttons;
            const activeCandidate = unambiguousCandidates.find(({active: active}) => active);
            if (activeCandidate) {
                if (currentVideoId && activeCandidate.videoId && activeCandidate.videoId !== currentVideoId) {
                    return undefined;
                }
                return activeCandidate.buttons;
            }
            if (currentVideoCandidates.length > 0) return currentVideoCandidates[0].buttons;
            const visibleIdentitylessCandidates = unambiguousCandidates.filter(({intersectsViewport: visible, videoId: videoId}) => visible && !videoId);
            return visibleIdentitylessCandidates.length === 1 ? visibleIdentitylessCandidates[0].buttons : undefined;
        }
        function getButtons() {
            if (isShorts()) {
                const elements = isMobile() ? querySelectorAll(extConfig.selectors.buttons.shorts.mobile) : querySelectorAll(extConfig.selectors.buttons.shorts.desktop);
                return selectCurrentShortsButtons(elements);
            }
            if (isMobile()) {
                return document.querySelector(extConfig.selectors.buttons.regular.mobile);
            }
            return selectCurrentWatchButtons(getDesktopWatchButtonCandidates());
        }
        function getLikeButton(buttons = getButtons()) {
            if (!buttons) return undefined;
            return isSegmentedButtonLayout(buttons) ? querySelector(extConfig.selectors.buttons.likeButton.segmented, buttons) ?? querySelector(extConfig.selectors.buttons.likeButton.segmentedGetButtons, buttons) : querySelector(extConfig.selectors.buttons.likeButton.notSegmented, buttons);
        }
        function getLikeTextContainer(likeButton = getLikeButton()) {
            if (!likeButton) return undefined;
            return querySelector(extConfig.selectors.likeTextContainer, likeButton);
        }
        function isSyntheticShortsDislike(dislikeButton) {
            return dislikeButton?.matches?.(SYNTHETIC_SHORTS_DISLIKE_SELECTOR) === true;
        }
        function setSyntheticShortsDislikePressed(pressed, dislikeButton = getDislikeButton()) {
            if (!isSyntheticShortsDislike(dislikeButton)) return false;
            dislikeButton.classList.toggle("style-default-active", pressed);
            dislikeButton.classList.toggle("style-text", !pressed);
            dislikeButton.querySelector("button")?.setAttribute("aria-pressed", String(pressed));
            return true;
        }
        function setSyntheticShortsDislikeEnabled(enabled, dislikeButton = getDislikeButton()) {
            if (!isSyntheticShortsDislike(dislikeButton)) return false;
            const button = dislikeButton.querySelector("button");
            if (!button) return false;
            button.disabled = !enabled;
            button.setAttribute("aria-disabled", String(!enabled));
            return true;
        }
        function ensureSyntheticShortsDislikeButton(buttons, {allowUnhydratedFallback: allowUnhydratedFallback = false, currentVideoId: currentVideoId = getVideoId(window.location.href), isHydrated: isHydrated = false, isStable: isStable = false} = {}) {
            if (!buttons || !isShorts() || isMobile()) return undefined;
            const existingSynthetics = Array.from(buttons.querySelectorAll(SYNTHETIC_SHORTS_DISLIKE_SELECTOR));
            const existing = existingSynthetics[0];
            const nativeDislike = buttons.querySelector("dislike-button-view-model, #dislike-button");
            const candidateVideoId = getShortsCandidateVideoId(buttons);
            const readyForMutation = shortsControlSurfaceIsReadyForMutation(buttons, currentVideoId, {
                allowUnhydratedFallback: allowUnhydratedFallback,
                isHydrated: isHydrated && actionBarHasHydratedData(buttons),
                isStable: isStable
            });
            if (nativeDislike) {
                if (readyForMutation) existingSynthetics.forEach(synthetic => synthetic.remove());
                return nativeDislike;
            }
            if (!readyForMutation) return existing ?? undefined;
            const videoId = candidateVideoId ?? currentVideoId;
            if (existing) {
                existingSynthetics.slice(1).forEach(synthetic => synthetic.remove());
                if (videoId && existing.getAttribute("data-ryd-video-id") !== videoId) {
                    existing.setAttribute("data-ryd-video-id", videoId);
                    setSyntheticShortsDislikePressed(false, existing);
                    setSyntheticShortsDislikeEnabled(false, existing);
                    const count = existing.querySelector("#text, [role='text']");
                    if (count) count.textContent = "";
                }
                return existing;
            }
            const likeButton = buttons.querySelector("like-button-view-model");
            const nativeLikeButton = likeButton?.querySelector("button");
            if (!likeButton || !nativeLikeButton) return undefined;
            const dislikeButton = document.createElement("div");
            dislikeButton.className = likeButton.getAttribute("class") || "";
            dislikeButton.classList.add("ryd-synthetic-shorts-dislike", "style-text");
            dislikeButton.setAttribute("data-ryd-role", "dislike");
            dislikeButton.setAttribute("data-ryd-synthetic-shorts-dislike", "true");
            if (videoId) dislikeButton.setAttribute("data-ryd-video-id", videoId);
            const label = document.createElement("label");
            label.className = nativeLikeButton.closest("label")?.getAttribute("class") || "ytSpecButtonShapeWithLabelHost";
            label.classList.add("ryd-synthetic-shorts-dislike-label");
            const button = document.createElement("button");
            button.type = "button";
            button.className = nativeLikeButton.getAttribute("class") || "ytSpecButtonShapeNextHost";
            button.setAttribute("aria-label", "Dislike this video");
            button.setAttribute("aria-pressed", "false");
            button.setAttribute("aria-disabled", "true");
            button.disabled = true;
            const icon = document.createElement("span");
            icon.className = nativeLikeButton.querySelector(".ytSpecButtonShapeNextIcon, .yt-spec-button-shape-next__icon")?.getAttribute("class") || "ytSpecButtonShapeNextIcon";
            icon.setAttribute("aria-hidden", "true");
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 18 18");
            svg.setAttribute("width", "24");
            svg.setAttribute("focusable", "false");
            svg.setAttribute("aria-hidden", "true");
            const path = document.createElementNS(svgNamespace, "path");
            path.setAttribute("d", SHORTS_DISLIKE_ICON_PATH);
            svg.appendChild(path);
            icon.appendChild(svg);
            button.appendChild(icon);
            const countContainer = document.createElement("div");
            countContainer.className = likeButton.querySelector(".ytSpecButtonShapeWithLabelLabel, .yt-spec-button-shape-with-label__label")?.getAttribute("class") || "ytSpecButtonShapeWithLabelLabel";
            const count = document.createElement("span");
            count.id = "text";
            count.className = likeButton.querySelector("span[role='text']")?.getAttribute("class") || "ytAttributedStringHost ytAttributedStringTextAlignmentCenter";
            count.setAttribute("role", "text");
            countContainer.appendChild(count);
            label.append(button, countContainer);
            dislikeButton.appendChild(label);
            likeButton.insertAdjacentElement("afterend", dislikeButton);
            return dislikeButton;
        }
        function getDislikeButton(buttons = getButtons()) {
            if (!buttons) return undefined;
            const syntheticShortsDislike = isShorts() ? buttons.querySelector(SYNTHETIC_SHORTS_DISLIKE_SELECTOR) ?? undefined : undefined;
            if (isSegmentedButtonLayout(buttons)) {
                return querySelector(extConfig.selectors.buttons.dislikeButton.segmented, buttons) ?? querySelector(extConfig.selectors.buttons.dislikeButton.segmentedGetButtons, buttons);
            }
            if (isShorts()) {
                const semanticSelectors = extConfig.selectors.buttons.dislikeButton.notSegmented.filter(selector => selector !== ":nth-child(2)");
                return querySelector(semanticSelectors, buttons) ?? querySelector(extConfig.selectors.buttons.dislikeButton.shortsFallback, buttons) ?? syntheticShortsDislike;
            }
            const notSegmentedMatch = querySelector(extConfig.selectors.buttons.dislikeButton.notSegmented, buttons);
            if (notSegmentedMatch != null) {
                return notSegmentedMatch;
            }
            return null;
        }
        function getTextContainerTemplate(likeButton, buttons) {
            if (!likeButton || !buttons || !buttons.contains(likeButton)) return undefined;
            const parentTemplate = querySelector(extConfig.selectors.likeTextContainerTemplateParent, likeButton) ?? querySelector(extConfig.selectors.likeTextContainerTemplateParent, buttons);
            return querySelector(extConfig.selectors.likeTextContainerTemplate, likeButton) ?? querySelector(extConfig.selectors.likeTextContainerTemplate, buttons) ?? parentTemplate?.parentNode;
        }
        function findDislikeTextContainer(dislikeButton, nativeDislikeButton) {
            if (!dislikeButton) return undefined;
            for (const selector of extConfig.selectors.dislikeTextContainer) {
                const result = dislikeButton.querySelector(selector);
                if (result !== null && result !== nativeDislikeButton) {
                    return matchesConfiguredSelector(result, extConfig.selectors.textContainerInner) ? result : querySelector(extConfig.selectors.textContainerInner, result) ?? result;
                }
            }
        }
        function isReactionControlHost(element) {
            const tagName = element?.tagName?.toLowerCase() ?? "";
            return tagName === "button" || tagName.includes("-") || element?.hasAttribute("data-ryd-role");
        }
        function matchesConfiguredSelector(element, selectors) {
            if (!element) return false;
            return (Array.isArray(selectors) ? selectors : [ selectors ]).some(selector => selector && element.matches(selector));
        }
        function getSemanticControlSelectors(role) {
            const selectorConfig = extConfig.selectors.buttons[`${role}Button`];
            return [ ...selectorConfig.segmented, ...selectorConfig.notSegmented ].filter(selector => selector && !selector.trim().startsWith(":"));
        }
        function hasSemanticReactionStructure(buttons, likeButton, dislikeButton, nativeLikeButton, nativeDislikeButton) {
            const segmentedSelectors = extConfig.selectors.buttons.segmentedContainer;
            const hasSegmentedContainer = matchesConfiguredSelector(buttons, segmentedSelectors) || querySelector(segmentedSelectors, buttons) !== undefined;
            const hasSemanticPair = matchesConfiguredSelector(likeButton, getSemanticControlSelectors("like")) && matchesConfiguredSelector(dislikeButton, getSemanticControlSelectors("dislike"));
            if (hasSegmentedContainer || hasSemanticPair) return true;
            const positionalRootSelectors = [ ...extConfig.selectors.buttons.regular.desktopNoMenu, ...extConfig.selectors.buttons.regular.mobile, ...extConfig.selectors.buttons.shorts.desktop, ...extConfig.selectors.buttons.shorts.mobile ];
            return matchesConfiguredSelector(buttons, positionalRootSelectors) && nativeLikeButton?.hasAttribute("aria-pressed") && nativeDislikeButton?.hasAttribute("aria-pressed");
        }
        function getButtonControls(buttons = getButtons()) {
            const likeButton = getLikeButton(buttons);
            const dislikeButton = getDislikeButton(buttons);
            const nativeLikeButton = getNativeButton(likeButton);
            const nativeDislikeButton = getNativeButton(dislikeButton);
            const dislikeTextContainer = findDislikeTextContainer(dislikeButton, nativeDislikeButton);
            const textContainerTemplate = getTextContainerTemplate(likeButton, buttons);
            const ready = Boolean(buttons?.isConnected && likeButton?.isConnected && dislikeButton?.isConnected && nativeLikeButton?.isConnected && nativeDislikeButton?.isConnected && isReactionControlHost(likeButton) && isReactionControlHost(dislikeButton) && buttons.contains(likeButton) && buttons.contains(dislikeButton) && likeButton.contains(nativeLikeButton) && dislikeButton.contains(nativeDislikeButton) && hasSemanticReactionStructure(buttons, likeButton, dislikeButton, nativeLikeButton, nativeDislikeButton) && (dislikeTextContainer || textContainerTemplate));
            return {
                buttons: buttons,
                dislikeButton: dislikeButton,
                dislikeTextContainer: dislikeTextContainer,
                likeButton: likeButton,
                nativeDislikeButton: nativeDislikeButton,
                nativeLikeButton: nativeLikeButton,
                ready: ready,
                textContainerTemplate: textContainerTemplate
            };
        }
        function hasUsableButtonStructure(buttons) {
            return getButtonControls(buttons).ready;
        }
        function updateDislikeButtonShape(dislikeButton) {
            for (const className of extConfig.selectors.buttonClasses.iconButton) {
                dislikeButton.classList.remove(className);
            }
            for (const className of extConfig.selectors.buttonClasses.iconLeading) {
                dislikeButton.classList.add(className);
            }
        }
        function createDislikeTextContainer(controls = getButtonControls()) {
            const {dislikeButton: dislikeButton, dislikeTextContainer: dislikeTextContainer, nativeDislikeButton: nativeDislikeButton, textContainerTemplate: textContainerTemplate} = controls;
            if (dislikeTextContainer) return dislikeTextContainer;
            if (!controls.ready || !nativeDislikeButton?.isConnected || !dislikeButton?.contains(nativeDislikeButton) || !textContainerTemplate?.isConnected) {
                return undefined;
            }
            const textNodeClone = textContainerTemplate.cloneNode(true);
            let textContainer = matchesConfiguredSelector(textNodeClone, extConfig.selectors.textContainerInner) ? textNodeClone : querySelector(extConfig.selectors.textContainerInner, textNodeClone);
            if (textContainer === undefined) {
                textContainer = document.createElement("span");
                textContainer.setAttribute("role", "text");
                while (textNodeClone.firstChild) {
                    textNodeClone.removeChild(textNodeClone.firstChild);
                }
                textNodeClone.appendChild(textContainer);
            }
            if (!textContainer.id) textContainer.id = "text";
            textContainer.innerText = "";
            nativeDislikeButton.insertBefore(textNodeClone, null);
            updateDislikeButtonShape(nativeDislikeButton);
            return textContainer;
        }
        function getDislikeTextContainer(controls = getButtonControls()) {
            return controls.dislikeTextContainer ?? createDislikeTextContainer(controls);
        }
        function checkForSignInButton() {
            if (querySelector(extConfig.selectors.signInButton)) {
                return true;
            } else {
                return false;
            }
        }
        var bar_getButtons;
        var bar_getLikeButton;
        var bar_getDislikeButton;
        var bar_isShorts;
        var bar_isMobile;
        var isLikesDisabled;
        var isRoundedDesign;
        var bar_extConfig;
        var isNewDesign;
        var bar_querySelector;
        var bar_getVideoId;
        var isInViewport;
        var getColorFromTheme;
        function closestConfigured(element, selectors) {
            for (const selector of Array.isArray(selectors) ? selectors : [ selectors ]) {
                const match = selector ? element?.closest(selector) : null;
                if (match) return match;
            }
            return null;
        }
        function findInCurrentWatchTree(buttons, selectors, fallbackScope = null) {
            const closest = closestConfigured(buttons, selectors);
            if (closest) return closest;
            const watchRoot = buttons?.closest("ytd-watch-flexy, ytd-watch-grid");
            const scope = fallbackScope ?? watchRoot;
            return scope ? bar_querySelector(selectors, scope) : undefined;
        }
        function findRateBarOwner(buttons, rateBar) {
            let owner = rateBar;
            while (owner?.parentElement && owner.parentElement !== buttons) {
                owner = owner.parentElement;
            }
            return owner?.parentElement === buttons ? owner : rateBar;
        }
        function hasHiddenOrCollapsedStyle(element) {
            if (!element || element.hidden) return true;
            const style = window.getComputedStyle(element);
            if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || Number.parseFloat(style.opacity || "1") === 0) {
                return true;
            }
            const explicitWidth = element.style.width.trim();
            return explicitWidth !== "" && Number.parseFloat(explicitWidth) === 0;
        }
        function getRateBarParts(buttons) {
            const containers = buttons ? [ ...buttons.querySelectorAll("#ryd-bar-container") ] : [];
            const rateBar = containers[0] ?? null;
            const owner = rateBar ? findRateBarOwner(buttons, rateBar) : null;
            const wrapper = rateBar?.closest(".ryd-tooltip") ?? null;
            return {
                containers: containers,
                fill: rateBar?.querySelector("#ryd-bar") ?? null,
                owner: owner,
                rateBar: rateBar,
                tooltip: owner?.querySelector("#ryd-dislike-tooltip") ?? null,
                wrapper: wrapper
            };
        }
        function hasUsableRateBar(buttons = bar_getButtons(), videoId = bar_getVideoId(window.location.href)) {
            const {containers: containers, fill: fill, owner: owner, rateBar: rateBar, tooltip: tooltip, wrapper: wrapper} = getRateBarParts(buttons);
            return Boolean(videoId && containers.length === 1 && rateBar && fill && tooltip && wrapper && owner === wrapper && wrapper.parentElement === buttons && wrapper.getAttribute("data-ryd-video-id") === videoId && !hasHiddenOrCollapsedStyle(wrapper) && !hasHiddenOrCollapsedStyle(rateBar));
        }
        function removeRateBarParts(buttons) {
            const owners = new Set([ ...buttons?.querySelectorAll("#ryd-bar-container") ?? [] ].map(rateBar => findRateBarOwner(buttons, rateBar)));
            for (const owner of owners) owner?.remove();
        }
        function createRateBar(likes, dislikes) {
            const buttons = bar_getButtons();
            const videoId = bar_getVideoId(window.location.href);
            for (const wrapper of document.querySelectorAll(".ryd-tooltip")) {
                if (!buttons?.contains(wrapper)) wrapper.remove();
            }
            let rateBar = buttons?.querySelector("#ryd-bar-container");
            if (!bar_isShorts() && (!videoId || bar_isMobile())) {
                return;
            }
            if (!isLikesDisabled()) {
                if (rateBar && (!hasUsableRateBar(buttons, videoId) || !isInViewport(rateBar))) {
                    removeRateBarParts(buttons);
                    rateBar = null;
                }
                const widthPx = parseFloat(window.getComputedStyle(bar_getLikeButton()).width) + parseFloat(window.getComputedStyle(bar_getDislikeButton()).width) + (isRoundedDesign() ? 0 : 8);
                const widthPercent = likes + dislikes > 0 ? likes / (likes + dislikes) * 100 : 50;
                var likePercentage = parseFloat(widthPercent.toFixed(1));
                const dislikePercentage = (100 - likePercentage).toLocaleString();
                likePercentage = likePercentage.toLocaleString();
                if (bar_extConfig.showTooltipPercentage) {
                    var tooltipInnerHTML;
                    switch (bar_extConfig.tooltipPercentageMode) {
                      case "dash_dislike":
                        tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
                        break;

                      case "both":
                        tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
                        break;

                      case "only_like":
                        tooltipInnerHTML = `${likePercentage}%`;
                        break;

                      case "only_dislike":
                        tooltipInnerHTML = `${dislikePercentage}%`;
                        break;

                      default:
                        tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
                    }
                } else {
                    tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
                }
                if (!bar_isShorts()) {
                    if (!rateBar) {
                        let colorLikeStyle = "";
                        let colorDislikeStyle = "";
                        if (bar_extConfig.coloredBar) {
                            colorLikeStyle = "; background-color: " + getColorFromTheme(true);
                            colorDislikeStyle = "; background-color: " + getColorFromTheme(false);
                        }
                        const actions = buttons;
                        const targetBar = actions || bar_querySelector(bar_extConfig.selectors.rateBar.mobileActionBar);
                        if (targetBar) {
                            const rateBarWrapper = document.createElement("div");
                            rateBarWrapper.setAttribute("data-ryd-ratebar-wrapper", "");
                            rateBarWrapper.className = `ryd-tooltip ryd-tooltip-${isNewDesign() ? "new" : "old"}-design`;
                            rateBarWrapper.style.width = widthPx + "px";
                            const barContainerOuter = document.createElement("div");
                            barContainerOuter.className = "ryd-tooltip-bar-container";
                            const barContainer = document.createElement("div");
                            barContainer.id = "ryd-bar-container";
                            barContainer.style.width = "100%";
                            barContainer.style.height = "2px";
                            if (bar_extConfig.coloredBar) {
                                barContainer.style.backgroundColor = getColorFromTheme(false);
                            }
                            const barFill = document.createElement("div");
                            barFill.id = "ryd-bar";
                            barFill.style.width = widthPercent + "%";
                            barFill.style.height = "100%";
                            if (bar_extConfig.coloredBar) {
                                barFill.style.backgroundColor = getColorFromTheme(true);
                            }
                            barContainer.appendChild(barFill);
                            barContainerOuter.appendChild(barContainer);
                            rateBarWrapper.appendChild(barContainerOuter);
                            const tooltipElem = document.createElement("tp-yt-paper-tooltip");
                            tooltipElem.setAttribute("position", "top");
                            tooltipElem.id = "ryd-dislike-tooltip";
                            tooltipElem.className = "style-scope ytd-sentiment-bar-renderer";
                            tooltipElem.setAttribute("role", "tooltip");
                            tooltipElem.setAttribute("tabindex", "-1");
                            tooltipElem.textContent = tooltipInnerHTML.replace(/&nbsp;/g, " ");
                            rateBarWrapper.appendChild(tooltipElem);
                            targetBar.appendChild(rateBarWrapper);
                        }
                        getRateBarParts(buttons).wrapper?.setAttribute("data-ryd-video-id", videoId);
                        if (isNewDesign()) {
                            const descriptionAndActionsElement = findInCurrentWatchTree(buttons, bar_extConfig.selectors.rateBar.topRow);
                            if (descriptionAndActionsElement) {
                                descriptionAndActionsElement.style.borderBottom = "1px solid var(--yt-spec-10-percent-layer)";
                                descriptionAndActionsElement.style.paddingBottom = "10px";
                            }
                        }
                    } else {
                        const currentParts = getRateBarParts(buttons);
                        currentParts.wrapper.setAttribute("data-ryd-video-id", videoId);
                        currentParts.wrapper.style.width = widthPx + "px";
                        currentParts.fill.style.width = widthPercent + "%";
                        const tooltipHost = buttons.querySelector("#ryd-dislike-tooltip");
                        const tooltip = tooltipHost?.querySelector("#tooltip") ?? tooltipHost;
                        if (tooltip) tooltip.textContent = tooltipInnerHTML.replace(/&nbsp;/g, " ");
                        if (bar_extConfig.coloredBar) {
                            currentParts.rateBar.style.backgroundColor = getColorFromTheme(false);
                            currentParts.fill.style.backgroundColor = getColorFromTheme(true);
                        }
                    }
                }
            } else {
                console.log("removing bar");
                if (rateBar) {
                    (rateBar.closest(".ryd-tooltip") ?? rateBar).remove();
                }
            }
        }
        const {DISLIKED_STATE: DISLIKED_STATE, DISLIKE_ACTION: DISLIKE_ACTION, LIKED_STATE: LIKED_STATE, LIKE_ACTION: LIKE_ACTION, NEUTRAL_STATE: NEUTRAL_STATE, applyVoteTransitionCounts: applyVoteTransitionCounts, resolveVoteTransition: resolveVoteTransition, shouldSubmitVote: shouldSubmitVote} = vote_transition_core_namespaceFn();
        var vote_data_request_getApiEndpoint;
        const WITHOUT_LIKE_COUNT = "without-like-count";
        const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;
        const LIVE_BUILD_ID_PATTERN = /^[a-f0-9]{32}$/;
        const LIVE_ACCEPT_MEDIA_TYPE = "application/vnd.ryd-live+json";
        const liveTestBuild = null && (true && false === true);
        const compiledLiveBuildId = null && (false ? 0 : "");
        let activeVideoId = null;
        let activeRequestController = null;
        let requestsByLikeCount = new Map;
        let latestRequest = null;
        function currentExtensionId() {
            return globalThis.chrome?.runtime?.id ?? globalThis.browser?.runtime?.id ?? "";
        }
        function createVoteDataAcceptHeader({buildId: buildId = compiledLiveBuildId, extensionId: extensionId = currentExtensionId(), isLiveTestBuild: isLiveTestBuild = liveTestBuild} = {}) {
            if (!isLiveTestBuild) return "application/json";
            if (!EXTENSION_ID_PATTERN.test(extensionId)) {
                throw new Error("A live-test vote-data request requires a valid extension ID.");
            }
            if (!LIVE_BUILD_ID_PATTERN.test(buildId)) {
                throw new Error("A live-test vote-data request requires a valid build ID.");
            }
            const header = `application/json, ${LIVE_ACCEPT_MEDIA_TYPE}; id=${extensionId}; build=${buildId}`;
            if (header.length > 128) throw new Error("The live-test vote-data fingerprint exceeds the CORS safelist limit.");
            return header;
        }
        function normalizeLikeCount(likeCount) {
            if (likeCount === null || likeCount === undefined || likeCount === false || likeCount === "") {
                return null;
            }
            const parsed = typeof likeCount === "number" ? likeCount : Number(likeCount);
            return Number.isSafeInteger(parsed) && parsed >= 0 ? String(parsed) : null;
        }
        function resetForVideo(videoId) {
            if (activeVideoId === videoId) return;
            clearVoteDataRequestCache();
            activeVideoId = videoId;
            activeRequestController = new AbortController;
        }
        function removeFailedRequest(record) {
            if (requestsByLikeCount.get(record.key) === record) {
                requestsByLikeCount.delete(record.key);
            }
            if (latestRequest === record) {
                const remainingRequests = Array.from(requestsByLikeCount.values());
                latestRequest = remainingRequests[remainingRequests.length - 1] ?? null;
            }
        }
        function requestVoteData(videoId, {fetchImpl: fetchImpl = globalThis.fetch, likeCount: likeCount = null} = {}) {
            if (typeof videoId !== "string" || videoId.length === 0) {
                return Promise.reject(new TypeError("A video ID is required to request vote data."));
            }
            if (typeof fetchImpl !== "function") {
                return Promise.reject(new TypeError("A fetch implementation is required to request vote data."));
            }
            resetForVideo(videoId);
            const normalizedLikeCount = normalizeLikeCount(likeCount);
            if (normalizedLikeCount === null && latestRequest) {
                return latestRequest.promise;
            }
            const key = normalizedLikeCount ?? WITHOUT_LIKE_COUNT;
            const existing = requestsByLikeCount.get(key);
            if (existing) {
                return existing.promise;
            }
            const likeCountQuery = normalizedLikeCount === null ? "" : `&likeCount=${encodeURIComponent(normalizedLikeCount)}`;
            const url = vote_data_request_getApiEndpoint(`/votes?videoId=${encodeURIComponent(videoId)}${likeCountQuery}`);
            const record = {
                key: key,
                promise: null
            };
            const {signal: signal} = activeRequestController;
            let fetchResult;
            try {
                fetchResult = fetchImpl(url, {
                    method: "GET",
                    headers: {
                        Accept: createVoteDataAcceptHeader()
                    },
                    signal: signal
                });
            } catch (error) {
                fetchResult = Promise.reject(error);
            }
            record.promise = Promise.resolve(fetchResult).then(response => {
                if (!response?.ok) {
                    throw new Error(`Vote data request failed with HTTP ${response?.status ?? "unknown"}.`);
                }
                return response.json();
            }).then(payload => {
                if (signal.aborted) {
                    throw new DOMException("Vote data request cancelled by navigation.", "AbortError");
                }
                return payload;
            }).catch(error => {
                removeFailedRequest(record);
                if (signal.aborted && error?.name !== "AbortError") {
                    throw new DOMException("Vote data request cancelled by navigation.", "AbortError");
                }
                throw error;
            });
            requestsByLikeCount.set(key, record);
            latestRequest = record;
            return record.promise;
        }
        function clearVoteDataRequestCache() {
            activeRequestController?.abort();
            activeRequestController = null;
            activeVideoId = null;
            requestsByLikeCount = new Map;
            latestRequest = null;
        }
        function cancelObsoleteVoteDataRequests(videoId) {
            if (activeVideoId !== videoId) clearVoteDataRequestCache();
        }
        var state_getButtonControls;
        var state_getLikeTextContainer;
        var state_getLikeButton;
        var state_getDislikeButton;
        var state_getDislikeTextContainer;
        var state_isSyntheticShortsDislike;
        var state_setSyntheticShortsDislikePressed;
        var state_setSyntheticShortsDislikeEnabled;
        var publishHideClutterButtons;
        var HIDE_CLUTTER_BUTTONS_STORAGE_KEY;
        var normalizeHideClutterButtons;
        var state_createRateBar;
        var state_querySelector;
        var createObserver;
        var state_getColorFromTheme;
        var getBrowser;
        var localize;
        var numberFormat;
        var state_getVideoId;
        var initializeLogging;
        var state_getApiEndpoint;
        var state_NEUTRAL_STATE;
        var state_LIKED_STATE;
        var state_DISLIKED_STATE;
        var createBrowserSyntheticDislikeStore;
        var state_requestVoteData;
        const DEFAULT_SELECTORS = {
            dislikeTextContainer: [ ".yt-spec-button-shape-next__button-text-content", ".ytSpecButtonShapeNextButtonTextContent", "#text", "yt-formatted-string", "span[role='text']" ],
            likeTextContainer: [ ".yt-spec-button-shape-next__button-text-content", ".ytSpecButtonShapeNextButtonTextContent", "#text", "yt-formatted-string", "span[role='text']" ],
            likeTextContainerTemplate: [ ".yt-spec-button-shape-next__button-text-content", ".ytSpecButtonShapeNextButtonTextContent", "button > div[class*='cbox']" ],
            likeTextContainerTemplateParent: [ 'div > span[role="text"]', 'button > div.yt-spec-button-shape-next__button-text-content > span[role="text"]' ],
            textContainerInner: [ "span[role='text']" ],
            buttons: {
                shorts: {
                    mobile: [ "ytm-like-button-renderer" ],
                    desktop: [ "reel-action-bar-view-model", "#like-button > ytd-like-button-renderer" ]
                },
                regular: {
                    mobile: [ ".slim-video-action-bar-actions" ],
                    desktopMenu: [ "ytd-menu-renderer.ytd-watch-metadata > div" ],
                    desktopNoMenu: [ "#top-level-buttons-computed" ]
                },
                segmentedContainer: [ "ytd-segmented-like-dislike-button-renderer" ],
                nativeButton: [ "button" ],
                mobileText: [ ".button-renderer-text" ],
                shortsToggleButton: [ "tp-yt-paper-button#button" ],
                smartimation: [ "yt-smartimation" ],
                likeButton: {
                    segmented: [ "#segmented-like-button" ],
                    segmentedGetButtons: [ ":first-child > :first-child" ],
                    notSegmented: [ "like-button-view-model", ":first-child" ]
                },
                dislikeButton: {
                    segmented: [ "#segmented-dislike-button" ],
                    segmentedGetButtons: [ ":first-child > :nth-child(2)" ],
                    notSegmented: [ "dislike-button-view-model", ":nth-child(2)", "#dislike-button" ],
                    shortsFallback: [ "#dislike-button" ]
                }
            },
            buttonClasses: {
                iconButton: [ "yt-spec-button-shape-next--icon-button", "ytSpecButtonShapeNextIconButton" ],
                iconLeading: [ "yt-spec-button-shape-next--icon-leading", "ytSpecButtonShapeNextIconLeading" ]
            },
            activeButtonClasses: [ "style-default-active" ],
            likeCountButton: [ "yt-formatted-string#text", "button" ],
            videoLoaded: [ "ytd-watch-grid[video-id='{videoId}']", "ytd-watch-flexy[video-id='{videoId}']", '#player[loading="false"]:not([hidden])' ],
            shortsLoaded: {
                containers: [ ".reel-video-in-sequence-new" ],
                thumbnail: [ ".reel-video-in-sequence-thumbnail" ],
                renderer: [ "ytd-reel-video-renderer" ],
                overlay: [ "#experiment-overlay" ]
            },
            rateBar: {
                newDesignActions: [ "#top-level-buttons-computed" ],
                oldDesignActions: [ "#menu-container" ],
                mobileActionBar: [ "ytm-slim-video-action-bar-renderer" ],
                topRow: [ "#top-row" ],
                actionsInner: [ "#actions-inner" ],
                actions: [ "#actions" ]
            },
            signInButton: [ "a[href^='https://accounts.google.com/ServiceLogin']" ],
            menuContainer: [ "#menu-container" ],
            roundedDesign: [ "#segmented-like-button", "like-button-view-model" ]
        };
        const SELECTOR_REQUEST_TIMEOUT_MS = 1500;
        function cloneConfig(value) {
            if (value === undefined) return undefined;
            return JSON.parse(JSON.stringify(value));
        }
        function mergeConfig(defaultValue, apiValue) {
            if (apiValue === undefined || apiValue === null) {
                return cloneConfig(defaultValue);
            }
            if (Array.isArray(apiValue)) {
                return [ ...apiValue ];
            }
            if (typeof apiValue !== "object" || Array.isArray(defaultValue)) {
                return apiValue;
            }
            const merged = cloneConfig(defaultValue ?? {});
            for (const [key, value] of Object.entries(apiValue)) {
                merged[key] = mergeConfig(defaultValue?.[key], value);
            }
            return merged;
        }
        let state_extConfig = {
            disableVoteSubmission: false,
            disableLogging: false,
            coloredThumbs: false,
            coloredBar: false,
            colorTheme: "classic",
            numberDisplayFormat: "compactShort",
            showTooltipPercentage: false,
            tooltipPercentageMode: "dash_like",
            numberDisplayReformatLikes: false,
            hidePremiumTeaser: false,
            hideClutterButtons: false,
            selectors: cloneConfig(DEFAULT_SELECTORS)
        };
        let storedData = null && {
            likes: 0,
            dislikes: 0,
            previousState: state_NEUTRAL_STATE,
            videoId: null
        };
        function state_isMobile() {
            return location.hostname == "m.youtube.com";
        }
        function state_isShorts() {
            return location.pathname.startsWith("/shorts");
        }
        function state_isNewDesign() {
            return document.getElementById("comment-teaser") !== null;
        }
        function state_isRoundedDesign() {
            return state_querySelector(state_extConfig.selectors.roundedDesign) !== null;
        }
        let shortsObserver = null;
        let syntheticDislikeStore = null;
        function getShortsObserver() {
            if (shortsObserver) return shortsObserver;
            console.log("Initializing shorts mutation observer");
            shortsObserver = createObserver({
                attributes: true
            }, mutationList => {
                mutationList.forEach(mutation => {
                    if (mutation.type === "attributes" && mutation.target.matches?.("button, tp-yt-paper-button#button")) {
                        if (mutation.target.getAttribute("aria-pressed") === "true") {
                            const isLike = mutation.target.closest("like-button-view-model, #like-button") !== null;
                            mutation.target.style.color = state_getColorFromTheme(isLike);
                        } else {
                            mutation.target.style.color = "unset";
                        }
                    }
                });
            });
            return shortsObserver;
        }
        function getSyntheticDislikeStore() {
            if (syntheticDislikeStore) return syntheticDislikeStore;
            const browserApi = getBrowser();
            if (!browserApi?.storage?.local) return null;
            syntheticDislikeStore = createBrowserSyntheticDislikeStore(browserApi.storage.local, () => browserApi.runtime?.lastError);
            return syntheticDislikeStore;
        }
        async function readSyntheticShortsDislikeState(videoId) {
            const store = getSyntheticDislikeStore();
            if (!store) return false;
            try {
                return await store.isDisliked(videoId);
            } catch (error) {
                console.debug("Could not restore the synthetic Shorts Dislike state.", error?.message ?? error);
                return false;
            }
        }
        async function persistSyntheticShortsDislikeState(videoId, disliked) {
            const store = getSyntheticDislikeStore();
            if (!store) return;
            await store.setDisliked(videoId, disliked);
        }
        function state_isLikesDisabled(controls = state_getButtonControls()) {
            if (state_isMobile()) {
                const mobileLikeText = state_querySelector(state_extConfig.selectors.buttons.mobileText, controls.likeButton) ?? state_getLikeTextContainer(controls.likeButton);
                if (mobileLikeText && /\d/.test(mobileLikeText.innerText)) {
                    return false;
                }
                const nativeLikeButton = controls.nativeLikeButton ?? controls.likeButton?.querySelector?.("button");
                const ariaLabel = nativeLikeButton?.getAttribute?.("aria-label");
                if (ariaLabel && /\d/.test(ariaLabel)) {
                    return false;
                }
                if (mobileLikeText && mobileLikeText.innerText.trim().length > 0) {
                    return true;
                }
                return false;
            }
            const likeTextContainer = state_getLikeTextContainer(controls.likeButton);
            return likeTextContainer ? /^\D*$/.test(likeTextContainer.innerText) : true;
        }
        function isVideoLiked() {
            const likeButton = state_querySelector(state_extConfig.selectors.buttons.nativeButton, state_getLikeButton());
            if (state_isMobile()) {
                return likeButton.getAttribute("aria-label") === "true";
            }
            return state_extConfig.selectors.activeButtonClasses.some(className => state_getLikeButton().classList.contains(className)) || likeButton?.getAttribute("aria-pressed") === "true";
        }
        function isVideoDisliked() {
            const dislikeButton = state_querySelector(state_extConfig.selectors.buttons.nativeButton, state_getDislikeButton());
            if (state_isMobile()) {
                return dislikeButton.getAttribute("aria-label") === "true";
            }
            return state_extConfig.selectors.activeButtonClasses.some(className => state_getDislikeButton().classList.contains(className)) || dislikeButton?.getAttribute("aria-pressed") === "true";
        }
        function getState(storedData) {
            if (isVideoLiked()) {
                return {
                    current: state_LIKED_STATE,
                    previous: storedData.previousState
                };
            }
            if (isVideoDisliked()) {
                return {
                    current: state_DISLIKED_STATE,
                    previous: storedData.previousState
                };
            }
            return {
                current: state_NEUTRAL_STATE,
                previous: storedData.previousState
            };
        }
        function setLikes(likesCount) {
            console.log(`SET likes ${likesCount}`);
            const likeTextContainer = state_getLikeTextContainer();
            if (!likeTextContainer) return false;
            likeTextContainer.innerText = likesCount;
            return true;
        }
        function setDislikes(dislikesCount) {
            console.log(`SET dislikes ${dislikesCount}`);
            const controls = state_getButtonControls();
            const _container = state_getDislikeTextContainer(controls);
            if (!_container) return false;
            _container?.removeAttribute("is-empty");
            let _dislikeText;
            if (!state_isLikesDisabled(controls)) {
                _dislikeText = dislikesCount;
            } else {
                console.log("likes count disabled by creator");
                _dislikeText = localize("TextLikesDisabled");
            }
            if (_dislikeText != null && _container?.innerText !== _dislikeText) {
                _container.innerText = _dislikeText;
            }
            return true;
        }
        function getLikeCountFromButton() {
            try {
                if (state_isShorts()) {
                    return false;
                }
                let likeButton = state_querySelector(state_extConfig.selectors.likeCountButton, state_getLikeButton());
                let likesStr = likeButton.getAttribute("aria-label").replace(/\D/g, "");
                return likesStr.length > 0 ? parseInt(likesStr) : false;
            } catch {
                return false;
            }
        }
        function processResponse(response, storedData) {
            const formattedDislike = numberFormat(response.dislikes);
            if (!setDislikes(formattedDislike)) return false;
            if (state_extConfig.numberDisplayReformatLikes === true) {
                const nativeLikes = getLikeCountFromButton();
                if (nativeLikes !== false) {
                    setLikes(numberFormat(nativeLikes));
                }
            }
            state_createRateBar(storedData.likes, storedData.dislikes);
            if (state_extConfig.coloredThumbs === true) {
                if (state_isShorts()) {
                    const shortLikeButton = state_querySelector(state_extConfig.selectors.buttons.shortsToggleButton, state_getLikeButton()) ?? state_getLikeButton()?.querySelector("button");
                    const shortDislikeButton = state_querySelector(state_extConfig.selectors.buttons.shortsToggleButton, state_getDislikeButton()) ?? state_getDislikeButton()?.querySelector("button");
                    if (shortLikeButton?.getAttribute("aria-pressed") === "true") {
                        shortLikeButton.style.color = state_getColorFromTheme(true);
                    }
                    if (shortDislikeButton?.getAttribute("aria-pressed") === "true") {
                        shortDislikeButton.style.color = state_getColorFromTheme(false);
                    }
                    const observer = getShortsObserver();
                    if (shortLikeButton) observer.observe(shortLikeButton);
                    if (shortDislikeButton) observer.observe(shortDislikeButton);
                } else {
                    state_getLikeButton().style.color = state_getColorFromTheme(true);
                    state_getDislikeButton().style.color = state_getColorFromTheme(false);
                }
            }
            return true;
        }
        function displayError(error, videoId = state_getVideoId(window.location.href)) {
            if (state_getVideoId(window.location.href) !== videoId) {
                return;
            }
            const dislikeTextContainer = state_getDislikeTextContainer();
            if (!dislikeTextContainer) return false;
            dislikeTextContainer.innerText = localize("textTempUnavailable");
            return true;
        }
        async function setState(storedData) {
            if (typeof window !== "undefined") {
                window.__rydSetStateCalls = (window.__rydSetStateCalls || 0) + 1;
            }
            const videoId = state_getVideoId(window.location.href);
            const dislikeButton = state_getDislikeButton();
            if (state_isSyntheticShortsDislike(dislikeButton)) {
                const storedDisliked = await readSyntheticShortsDislikeState(videoId);
                if (state_getVideoId(window.location.href) !== videoId) return;
                const liked = isVideoLiked();
                state_setSyntheticShortsDislikePressed(!liked && storedDisliked, dislikeButton);
                storedData.previousState = liked ? state_LIKED_STATE : storedDisliked ? state_DISLIKED_STATE : state_NEUTRAL_STATE;
                if (liked && storedDisliked) void persistSyntheticShortsDislikeState(videoId, false);
            } else {
                storedData.previousState = isVideoDisliked() ? state_DISLIKED_STATE : isVideoLiked() ? state_LIKED_STATE : state_NEUTRAL_STATE;
            }
            console.log("Video is loaded. Adding buttons...");
            const likeCount = getLikeCountFromButton() || null;
            let response;
            try {
                response = await state_requestVoteData(videoId, {
                    likeCount: likeCount
                });
            } catch (error) {
                if (error?.name === "AbortError") return false;
                displayError(error, videoId);
                return;
            }
            console.log("response from api:");
            console.log(JSON.stringify(response));
            if (state_getVideoId(window.location.href) !== videoId) {
                return;
            }
            if (!response || typeof response !== "object" || "traceId" in response) {
                displayError(response, videoId);
                return;
            }
            const currentControls = state_getButtonControls();
            if (currentControls.ready) {
                const liked = isVideoLiked();
                if (state_isSyntheticShortsDislike(currentControls.dislikeButton)) {
                    const disliked = storedData.previousState === state_DISLIKED_STATE;
                    state_setSyntheticShortsDislikePressed(!liked && disliked, currentControls.dislikeButton);
                    storedData.previousState = liked ? state_LIKED_STATE : disliked ? state_DISLIKED_STATE : state_NEUTRAL_STATE;
                    if (liked && disliked) void persistSyntheticShortsDislikeState(videoId, false);
                } else {
                    storedData.previousState = isVideoDisliked() ? state_DISLIKED_STATE : liked ? state_LIKED_STATE : state_NEUTRAL_STATE;
                }
            }
            storedData.dislikes = parseInt(response.dislikes);
            storedData.likes = parseInt(response.likes);
            storedData.videoId = videoId;
            return processResponse(response, storedData);
        }
        async function setInitialState() {
            return setState(storedData);
        }
        function hasLoadedStateForVideo(videoId) {
            return storedData.videoId === videoId;
        }
        function restoreCurrentState() {
            const dislikeButton = state_getDislikeButton();
            if (state_isSyntheticShortsDislike(dislikeButton)) {
                state_setSyntheticShortsDislikePressed(storedData.previousState === state_DISLIKED_STATE, dislikeButton);
            } else {
                storedData.previousState = isVideoDisliked() ? state_DISLIKED_STATE : isVideoLiked() ? state_LIKED_STATE : state_NEUTRAL_STATE;
            }
            if (!setDislikes(numberFormat(storedData.dislikes))) return false;
            state_createRateBar(storedData.likes, storedData.dislikes);
            return true;
        }
        function clearRenderedVoteState(controls = state_getButtonControls()) {
            if (!controls) return;
            if (controls.dislikeTextContainer) {
                controls.dislikeTextContainer.innerText = "";
            }
            if (state_isSyntheticShortsDislike(controls.dislikeButton)) {
                state_setSyntheticShortsDislikeEnabled(false, controls.dislikeButton);
                state_setSyntheticShortsDislikePressed(false, controls.dislikeButton);
            }
            for (const wrapper of controls.buttons?.querySelectorAll?.(".ryd-tooltip") ?? []) {
                wrapper.remove();
            }
        }
        async function initExtConfig() {
            initializeDisableVoteSubmission();
            initializeDisableLogging();
            initializeColoredThumbs();
            initializeColoredBar();
            initializeColorTheme();
            initializeNumberDisplayFormat();
            initializeTooltipPercentage();
            initializeTooltipPercentageMode();
            initializeNumberDisplayReformatLikes();
            initializeHidePremiumTeaser();
            await initializeHideClutterButtons();
            await initializeSelectors();
        }
        async function initializeSelectors() {
            const controller = new AbortController;
            const timeout = setTimeout(() => controller.abort(), SELECTOR_REQUEST_TIMEOUT_MS);
            try {
                const response = await fetch(state_getApiEndpoint("/configs/selectors"), {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    },
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error(`Selector request failed with HTTP ${response.status}`);
                }
                const result = await response.json();
                state_extConfig.selectors = mergeConfig(DEFAULT_SELECTORS, result);
                console.log(result);
                return true;
            } catch (error) {
                state_extConfig.selectors = cloneConfig(DEFAULT_SELECTORS);
                console.debug("Remote selectors unavailable; using bundled selectors.", error?.name ?? error);
                return false;
            } finally {
                clearTimeout(timeout);
            }
        }
        function initializeDisableVoteSubmission() {
            getBrowser().storage.sync.get([ "disableVoteSubmission" ], res => {
                if (res.disableVoteSubmission === undefined) {
                    getBrowser().storage.sync.set({
                        disableVoteSubmission: false
                    });
                } else {
                    state_extConfig.disableVoteSubmission = res.disableVoteSubmission;
                }
            });
        }
        function initializeDisableLogging() {
            getBrowser().storage.sync.get([ "disableLogging" ], res => {
                if (res.disableLogging === undefined) {
                    getBrowser().storage.sync.set({
                        disableLogging: true
                    });
                    state_extConfig.disableLogging = true;
                } else {
                    state_extConfig.disableLogging = res.disableLogging;
                }
                initializeLogging();
            });
        }
        function initializeColoredThumbs() {
            getBrowser().storage.sync.get([ "coloredThumbs" ], res => {
                if (res.coloredThumbs === undefined) {
                    getBrowser().storage.sync.set({
                        coloredThumbs: false
                    });
                } else {
                    state_extConfig.coloredThumbs = res.coloredThumbs;
                }
            });
        }
        function initializeColoredBar() {
            getBrowser().storage.sync.get([ "coloredBar" ], res => {
                if (res.coloredBar === undefined) {
                    getBrowser().storage.sync.set({
                        coloredBar: false
                    });
                } else {
                    state_extConfig.coloredBar = res.coloredBar;
                }
            });
        }
        function initializeColorTheme() {
            getBrowser().storage.sync.get([ "colorTheme" ], res => {
                if (res.colorTheme === undefined) {
                    getBrowser().storage.sync.set({
                        colorTheme: false
                    });
                } else {
                    state_extConfig.colorTheme = res.colorTheme;
                }
            });
        }
        function initializeNumberDisplayFormat() {
            getBrowser().storage.sync.get([ "numberDisplayFormat" ], res => {
                if (res.numberDisplayFormat === undefined) {
                    getBrowser().storage.sync.set({
                        numberDisplayFormat: "compactShort"
                    });
                } else {
                    state_extConfig.numberDisplayFormat = res.numberDisplayFormat;
                }
            });
        }
        function initializeTooltipPercentage() {
            getBrowser().storage.sync.get([ "showTooltipPercentage" ], res => {
                if (res.showTooltipPercentage === undefined) {
                    getBrowser().storage.sync.set({
                        showTooltipPercentage: false
                    });
                } else {
                    state_extConfig.showTooltipPercentage = res.showTooltipPercentage;
                }
            });
        }
        function initializeTooltipPercentageMode() {
            getBrowser().storage.sync.get([ "tooltipPercentageMode" ], res => {
                if (res.tooltipPercentageMode === undefined) {
                    getBrowser().storage.sync.set({
                        tooltipPercentageMode: "dash_like"
                    });
                } else {
                    state_extConfig.tooltipPercentageMode = res.tooltipPercentageMode;
                }
            });
        }
        function initializeNumberDisplayReformatLikes() {
            getBrowser().storage.sync.get([ "numberDisplayReformatLikes" ], res => {
                if (res.numberDisplayReformatLikes === undefined) {
                    getBrowser().storage.sync.set({
                        numberDisplayReformatLikes: false
                    });
                } else {
                    state_extConfig.numberDisplayReformatLikes = res.numberDisplayReformatLikes;
                }
            });
        }
        function initializeHidePremiumTeaser() {
            getBrowser().storage.sync.get([ "hidePremiumTeaser" ], res => {
                if (res.hidePremiumTeaser === undefined) {
                    getBrowser().storage.sync.set({
                        hidePremiumTeaser: false
                    });
                    state_extConfig.hidePremiumTeaser = false;
                } else {
                    state_extConfig.hidePremiumTeaser = res.hidePremiumTeaser === true;
                }
            });
        }
        function initializeHideClutterButtons() {
            const storage = getBrowser()?.storage?.sync;
            if (!storage) {
                state_extConfig.hideClutterButtons = publishHideClutterButtons(false);
                return Promise.resolve(false);
            }
            return new Promise(resolve => {
                storage.get([ HIDE_CLUTTER_BUTTONS_STORAGE_KEY ], (res = {}) => {
                    const storedValue = res[HIDE_CLUTTER_BUTTONS_STORAGE_KEY];
                    const normalized = normalizeHideClutterButtons(storedValue);
                    state_extConfig.hideClutterButtons = publishHideClutterButtons(normalized);
                    if (storedValue === undefined) {
                        storage.set({
                            [HIDE_CLUTTER_BUTTONS_STORAGE_KEY]: false
                        });
                    }
                    resolve(normalized);
                });
            });
        }
        var utils_extConfig;
        var utils_isShorts;
        const DEFAULT_SHORTS_LOADED_SELECTORS = null && {
            containers: [ ".reel-video-in-sequence-new" ],
            thumbnail: [ ".reel-video-in-sequence-thumbnail" ],
            renderer: [ "ytd-reel-video-renderer" ],
            mobileRenderer: [ "ytm-reel-video-renderer" ],
            overlay: [ "#experiment-overlay" ]
        };
        const DEFAULT_VIDEO_LOADED_SELECTORS = null && [ "ytd-watch-grid[video-id='{videoId}']", "ytd-watch-flexy[video-id='{videoId}']", '#player[loading="false"]:not([hidden])' ];
        function utils_numberFormat(numberState) {
            return getNumberFormatter(utils_extConfig.numberDisplayFormat).format(numberState);
        }
        function getNumberFormatter(optionSelect) {
            let userLocales;
            if (document.documentElement.lang) {
                userLocales = document.documentElement.lang;
            } else if (navigator.language) {
                userLocales = navigator.language;
            } else {
                try {
                    userLocales = new URL(Array.from(document.querySelectorAll("head > link[rel='search']"))?.find(n => n?.getAttribute("href")?.includes("?locale="))?.getAttribute("href"))?.searchParams?.get("locale");
                } catch {
                    console.log("Cannot find browser locale. Use en as default for number formatting.");
                    userLocales = "en";
                }
            }
            let formatterNotation;
            let formatterCompactDisplay;
            switch (optionSelect) {
              case "compactLong":
                formatterNotation = "compact";
                formatterCompactDisplay = "long";
                break;

              case "standard":
                formatterNotation = "standard";
                formatterCompactDisplay = "short";
                break;

              case "compactShort":
              default:
                formatterNotation = "compact";
                formatterCompactDisplay = "short";
            }
            return Intl.NumberFormat(userLocales, {
                notation: formatterNotation,
                compactDisplay: formatterCompactDisplay
            });
        }
        function utils_localize(localeString, substitutions) {
            try {
                if (typeof chrome !== "undefined" && chrome?.i18n?.getMessage) {
                    const args = substitutions === undefined ? [ localeString ] : [ localeString, substitutions ];
                    const message = chrome.i18n.getMessage(...args);
                    if (message) {
                        return message;
                    }
                }
            } catch (error) {
                console.warn("Localization lookup failed for", localeString, error);
            }
            if (Array.isArray(substitutions)) {
                return substitutions.join(" ");
            }
            if (substitutions != null) {
                return `${substitutions}`;
            }
            return localeString;
        }
        function utils_getBrowser() {
            if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
                return chrome;
            } else if (typeof browser !== "undefined" && typeof browser.runtime !== "undefined") {
                return browser;
            } else {
                console.log("browser is not supported");
                return false;
            }
        }
        function utils_getVideoId(url) {
            const urlObject = new URL(url);
            const pathname = urlObject.pathname;
            if (pathname.startsWith("/clip")) {
                return (document.querySelector("meta[itemprop='videoId']") || document.querySelector("meta[itemprop='identifier']")).content;
            } else {
                if (pathname.startsWith("/shorts")) {
                    return pathname.slice(8);
                }
                return urlObject.searchParams.get("v");
            }
        }
        function utils_isInViewport(element) {
            const rect = element.getBoundingClientRect();
            const height = innerHeight || document.documentElement.clientHeight;
            const width = innerWidth || document.documentElement.clientWidth;
            return !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) && rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width;
        }
        function getShortsRendererVideoId(renderer) {
            const rendererVideoId = renderer?.getAttribute("video-id");
            if (rendererVideoId) return rendererVideoId;
            const href = renderer?.querySelector("a[href*='/shorts/']")?.getAttribute("href");
            if (!href) return null;
            try {
                return utils_getVideoId(new URL(href, window.location.href).href);
            } catch {
                return null;
            }
        }
        function isRenderedInViewport(element) {
            if (!element || element.closest("[hidden], [aria-hidden='true'], [inert]")) return false;
            for (let current = element; current; current = current.parentElement) {
                const style = window.getComputedStyle(current);
                if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || Number.parseFloat(style.opacity || "1") === 0) {
                    return false;
                }
            }
            const rect = element.getBoundingClientRect();
            const height = innerHeight || document.documentElement.clientHeight;
            const width = innerWidth || document.documentElement.clientWidth;
            return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < height && rect.left < width;
        }
        function isShortsLoaded(videoId) {
            if (!videoId) return false;
            const selectors = utils_extConfig.selectors.shortsLoaded ?? DEFAULT_SHORTS_LOADED_SELECTORS;
            for (const renderer of utils_querySelectorAll(selectors.mobileRenderer ?? DEFAULT_SHORTS_LOADED_SELECTORS.mobileRenderer)) {
                if (!renderer.hasAttribute("is-active")) continue;
                if (getShortsRendererVideoId(renderer) !== videoId) continue;
                if (renderer.closest("[hidden], [aria-hidden='true'], [inert]")) continue;
                const style = window.getComputedStyle(renderer);
                const rect = renderer.getBoundingClientRect();
                if (style.display !== "none" && style.visibility !== "hidden" && style.visibility !== "collapse" && Number.parseFloat(style.opacity || "1") !== 0 && rect.width > 0 && rect.height > 0) {
                    return true;
                }
            }
            for (const renderer of utils_querySelectorAll(selectors.renderer ?? DEFAULT_SHORTS_LOADED_SELECTORS.renderer)) {
                if (getShortsRendererVideoId(renderer) !== videoId) continue;
                if (isRenderedInViewport(renderer)) return true;
            }
            const reelContainers = utils_querySelectorAll(selectors.containers);
            for (const container of reelContainers) {
                const thumbnail = utils_querySelector(selectors.thumbnail, container);
                if (thumbnail) {
                    const bgImage = thumbnail.style.backgroundImage;
                    if (bgImage && bgImage.includes(`/${videoId}/`) || !bgImage && utils_isInViewport(container)) {
                        const renderer = utils_querySelector(selectors.renderer, container);
                        if (renderer) {
                            const experimentOverlay = utils_querySelector(selectors.overlay, renderer);
                            if (experimentOverlay && !experimentOverlay.hidden && window.getComputedStyle(experimentOverlay).display !== "none" && experimentOverlay.hasChildNodes()) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        function isVideoLoaded() {
            const videoId = utils_getVideoId(window.location.href);
            if (utils_isShorts()) {
                return isShortsLoaded(videoId);
            }
            const videoLoadedSelectors = utils_extConfig.selectors.videoLoaded ?? DEFAULT_VIDEO_LOADED_SELECTORS;
            return utils_querySelector(videoLoadedSelectors.map(selector => selector.replace("{videoId}", videoId))) !== undefined;
        }
        const originalConsole = {
            log: console.log.bind(console),
            debug: console.debug.bind(console),
            info: console.info.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console)
        };
        function utils_initializeLogging() {
            if (utils_extConfig.disableLogging) {
                console.log = () => {};
                console.debug = () => {};
            } else {
                console.log = originalConsole.log;
                console.debug = originalConsole.debug;
            }
        }
        function utils_getColorFromTheme(voteIsLike) {
            let colorString;
            switch (utils_extConfig.colorTheme) {
              case "accessible":
                if (voteIsLike === true) {
                    colorString = "dodgerblue";
                } else {
                    colorString = "gold";
                }
                break;

              case "neon":
                if (voteIsLike === true) {
                    colorString = "aqua";
                } else {
                    colorString = "magenta";
                }
                break;

              case "classic":
              default:
                if (voteIsLike === true) {
                    colorString = "lime";
                } else {
                    colorString = "red";
                }
            }
            return colorString;
        }
        function utils_querySelector(selectors, element) {
            let result;
            for (const selector of Array.isArray(selectors) ? selectors : [ selectors ]) {
                if (!selector) continue;
                result = (element ?? document).querySelector(selector);
                if (result !== null) {
                    return result;
                }
            }
        }
        function utils_querySelectorAll(selectors) {
            let result;
            for (const selector of Array.isArray(selectors) ? selectors : [ selectors ]) {
                if (!selector) continue;
                result = document.querySelectorAll(selector);
                if (result.length !== 0) {
                    return result;
                }
            }
            return result ?? document.querySelectorAll("__ryd-missing-selector__");
        }
        function utils_createObserver(options, callback) {
            const observerWrapper = new Object;
            observerWrapper.options = options;
            observerWrapper.observer = new MutationObserver(callback);
            observerWrapper.observe = function(element) {
                this.observer.observe(element, this.options);
            };
            observerWrapper.disconnect = function() {
                this.observer.disconnect();
            };
            return observerWrapper;
        }
        const PATREON_JOIN_URL = "https://www.patreon.com/join/returnyoutubedislike/checkout?rid=8008649";
        const SUPPORT_DOC_URL = config.links?.help ?? "https://returnyoutubedislike.com/help";
        const COMMUNITY_URL = config.links?.discord ?? "https://discord.gg/mYnESY4Md5";
        function initChangelogPage() {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", setup);
            } else {
                setup();
            }
        }
        function setup() {
            applyLocaleMetadata();
            localizeHtmlPage();
            decorateScreenshotPlaceholders();
            bindActions();
        }
        function applyLocaleMetadata() {
            try {
                const browserLocale = chrome?.i18n?.getMessage?.("@@ui_locale");
                if (browserLocale) {
                    document.documentElement.lang = browserLocale;
                }
            } catch (error) {
                console.debug("Unable to resolve UI locale", error);
            }
        }
        function localizeHtmlPage() {
            const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue && node.nodeValue.indexOf("__MSG_") !== -1) {
                    node.nodeValue = node.nodeValue.replace(/__MSG_(\w+)__/g, (match, key) => key ? utils_localize(key) : "");
                }
            }
            const allElements = document.getElementsByTagName("*");
            for (let i = 0; i < allElements.length; i++) {
                const el = allElements[i];
                const attrs = ["title", "placeholder", "alt", "aria-label"];
                for (let a = 0; a < attrs.length; a++) {
                    const attrName = attrs[a];
                    const val = el.getAttribute(attrName);
                    if (val && val.indexOf("__MSG_") !== -1) {
                        el.setAttribute(attrName, val.replace(/__MSG_(\w+)__/g, (match, key) => key ? utils_localize(key) : ""));
                    }
                }
            }
        }
        function decorateScreenshotPlaceholders() {
            document.querySelectorAll("[data-screenshot]").forEach(wrapper => {
                const type = wrapper.getAttribute("data-screenshot");
                const labelKey = getPlaceholderLabelKey(type);
                if (!labelKey) return;
                const placeholder = wrapper.querySelector(".ryd-feature-card__placeholder");
                if (!placeholder) return;
                const label = utils_localize(labelKey);
                placeholder.setAttribute("role", "img");
                placeholder.setAttribute("aria-label", label);
                placeholder.title = label;
            });
        }
        function getPlaceholderLabelKey(type) {
            switch (type) {
              case "timeline":
                return "changelog_screenshot_label_timeline";

              case "map":
                return "changelog_screenshot_label_map";

              case "teaser":
                return "changelog_screenshot_label_teaser";

              default:
                return null;
            }
        }
        function bindActions() {
            const browser = utils_getBrowser();
            const upgradeButton = document.getElementById("ryd-changelog-upgrade");
            if (upgradeButton) {
                upgradeButton.addEventListener("click", event => {
                    event.preventDefault();
                    openExternal(PATREON_JOIN_URL, browser);
                });
            }
            const supportButton = document.getElementById("ryd-changelog-support");
            if (supportButton) {
                supportButton.addEventListener("click", event => {
                    event.preventDefault();
                    openExternal(SUPPORT_DOC_URL, browser);
                });
            }
            const contactButton = document.getElementById("ryd-changelog-contact");
            if (contactButton) {
                contactButton.addEventListener("click", event => {
                    event.preventDefault();
                    openExternal(COMMUNITY_URL, browser);
                });
            }
        }
        function openExternal(url, browser) {
            if (!url) return;
            try {
                if (browser && browser.tabs && typeof browser.tabs.create === "function") {
                    browser.tabs.create({
                        url: url
                    });
                    return;
                }
            } catch (error) {
                console.debug("tabs.create unavailable, falling back", error);
            }
            try {
                window.open(url, "_blank", "noopener");
            } catch (error) {
                console.warn("Failed to open external url", url, error);
            }
        }
        initChangelogPage();
    })();
})();