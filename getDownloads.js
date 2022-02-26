var osType, osName, osVersion, userAgent, appVersion, folderId;
var downloads = [];
var macOSXCodenames = {'10.5': 'Leopard', '10.6': 'Snow Leopard', '10.7': 'Lion', '10.8': 'Mountain Lion', '10.9': 'Mavericks', '10.10': 'Yosemite', '10.11': 'El Capitan'};

var releases = {'src': {'name': 'texworks-release-0.6.6.zip', 'type': 'application/zip', 'size': 12811919, 'url': 'https://github.com/TeXworks/texworks/archive/release-0.6.6.zip', 'timestamp': '2021-03-11T16:51:19Z', 'version': '0.6.6'}, 'osx': {'name': 'TeXworks-macos-0.6.6-202103111124-git_24442ac.dmg', 'type': 'application/x-apple-diskimage', 'size': 24531694, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.6/TeXworks-macos-0.6.6-202103111124-git_24442ac.dmg', 'timestamp': '2021-03-11T16:53:12Z', 'version': '0.6.6'}, 'win': {'name': 'TeXworks-win-setup-0.6.6-202103111145-git_24442ac.exe', 'type': 'application/x-ms-dos-executable', 'size': 24200231, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.6/TeXworks-win-setup-0.6.6-202103111145-git_24442ac.exe', 'timestamp': '2021-03-11T16:53:53Z', 'version': '0.6.6'}}

{'src': {'name': 'texworks-release-0.6.7.zip', 'type': 'application/zip', 'size': 12827327, 'url': 'https://github.com/TeXworks/texworks/archive/release-0.6.7.zip', 'timestamp': '2022-02-26T13:44:52Z', 'version': '0.6.7'}, 'osx': {'name': 'TeXworks-macos10.15-0.6.7-202202261113-git_23c4c74.dmg', 'type': 'application/x-apple-diskimage', 'size': 27768150, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.7/TeXworks-macos10.15-0.6.7-202202261113-git_23c4c74.dmg', 'timestamp': '2022-02-26T13:42:42Z', 'version': '0.6.7'}, 'win': {'name': 'TeXworks-win-setup-0.6.7-202202261139-git_23c4c74.exe', 'type': 'application/x-ms-dos-executable', 'size': 26442003, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.7/TeXworks-win-setup-0.6.7-202202261139-git_23c4c74.exe', 'timestamp': '2022-02-26T13:43:50Z', 'version': '0.6.7'}}


userAgent = navigator.userAgent;
appVersion = navigator.appVersion;

///////////////////////////// DEBUG
//appVersion = "Mac";
//userAgent = "Mac OS X 10.8"
//
//appVersion = "Win";
//
//appVersion = "";
//userAgent = "arch";
///////////////////////////// DEBUG

if (appVersion.indexOf("Win") > -1) {
    osName = "Windows";
    osType = "Windows";
} else if (appVersion.indexOf("Mac") > -1) {
    osType = "Mac";
    osName = "Mac OS X";
    var m = userAgent.match(/Mac\ OS\ X\ (\d+)(?:\.|_)(\d+)/);
    if (m && m.length >= 3) {
        osVersion = m[1] + "." + m[2];
    }
} else {
    if (userAgent.toLowerCase().indexOf('ubuntu') > -1) {
        osType = "Linux";
        osName = "Ubuntu";
    } else if (userAgent.toLowerCase().indexOf('opensuse') > -1) {
        osType = "Linux";
        osName = "openSUSE";
    } else if (userAgent.toLowerCase().indexOf('debian') > -1) {
        osType = "Linux";
        osName = "Debian";
    } else if (userAgent.toLowerCase().indexOf('fedora') > -1) {
        osType = "Linux";
        osName = "Fedora";
    } else if (navigator.platform.toLowerCase().indexOf('linux') > -1) {
        osType = "Linux";
    }
}

///////////////////////////// DEBUG
// osType = "Windows";
// osName = "Mac OS X";
// osVersion = "10.10";
///////////////////////////// DEBUG

function humanReadableFilesize(filesize) {
    "use strict";
    var prefixes = ['', 'k', 'M', 'G', 'T'], humanReadable = filesize, i;

    for (i = 0; i < prefixes.length; i += 1) {
        if (humanReadable < 1000) {
            break;
        }
        humanReadable /= 1000;
    }
    // If we've run out of prefixes, i will have been incremented one additional time
    if (i >= prefixes.length) {
        i = prefixes.length - 1;
    }

    return Math.round(10 * humanReadable) / 10 + "&nbsp;" + prefixes[i] + "B";
}

function formatDate(d) {
    "use strict";
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function makeDownloadLink(release, label) {
    "use strict";
    var html, m, info;
    html = '<a href="' + release.url + '" class="link">'; // TODO: safeguard
    html += label;
    info = [];

    info[info.length] = 'version&nbsp;' + release.version;
//        if (release.timestamp) {
//            info[info.length] = formatDate(new Date(release.timestamp));
//        }
    if (release.size > 0) {
        info[info.length] = humanReadableFilesize(release.size);
    }
    if (info.length > 0) {
        html += '<div class="info">' + info.join(', ') + '</div>';
    }
    html += '</a>';
    return html;
}

function updateUi() {
    "use strict";
    var m, html, el;

    html = '';

    if (osType === "Windows" && releases.win !== undefined) {
        html = makeDownloadLink(releases.win, "Get TeXworks for Windows");
    }
    if (osType === "Mac" && releases.osx !== undefined) {
        html = makeDownloadLink(releases.osx, "Get TeXworks for Mac&nbsp;OS&nbsp;X");
    }
    if (osType === "Linux") {
        if (osName === 'Ubuntu') {
            html = '<a href="https://launchpad.net/~texworks/+archive/stable/" class="link">Get TeXworks for Ubuntu</a>';
        }
        if (osName === 'openSUSE') {
            html = '<a href="http://software.opensuse.org/search?q=texworks&baseproject=ALL&lang=en&exclude_debug=true" class="link">Get TeXworks for openSUSE</a>';
        }
        if (osName === 'Debian') {
            html = '<a href="http://packages.debian.org/de/sid/texworks" class="link">Get TeXworks for Debian</a>';
        }
        if (osName === 'Fedora') {
            html = '<a href="https://admin.fedoraproject.org/pkgdb/package/texworks/" class="link">Get TeXworks for Fedora</a>';
        }
    }

    if (html === '' && osType !== "Windows" && osType !== "Mac" && releases.src !== undefined) {
        // Fallback: Sources
        html = makeDownloadLink(releases.src, "Get TeXworks Sources");
    }

    if (html !== '') {
        if (osType === "Windows") {
            html += '<div class="other_ways">Alternatively, your TeX distribution may offer a TeXworks package.</div>';
        } else if (osType === "Linux") {
            html += '<div class="other_ways">Alternatively, your Linux distribution may already offer a TeXworks package.</div>';
        }
    } else {
        // Final fallback: Redirect the user to GitHub
        // (should not happen)
        html = '<a href="https://github.com/TeXworks/texworks/releases" class="link">Get TeXworks</a>';
    }
    html += '<div class="other_ways">Not what you are looking for? Check <a href="#Getting_TeXworks">Getting TeXworks</a> for other ways to obtain TeXworks.</div>';

    el = document.getElementById("tw_downloads");
    el.innerHTML = html;
    el.parentNode.style.display = 'block';
}

updateUi();
