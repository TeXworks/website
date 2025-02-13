var osType, osName, osVersion, userAgent, appVersion;

var releases = {'src': {'name': 'texworks-release-0.6.10.zip', 'type': 'application/zip', 'size': 11926470, 'url': 'https://github.com/TeXworks/texworks/archive/release-0.6.10.zip', 'timestamp': '2025-02-13T20:22:14Z', 'version': '0.6.10'}, 'linux': {'name': 'TeXworks-0.6.10-x86_64-202502131354-git_7380941.AppImage', 'type': 'application/vnd.appimage', 'size': 43107520, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.10/TeXworks-0.6.10-x86_64-202502131354-git_7380941.AppImage', 'timestamp': '2025-02-13T20:19:09Z', 'minOSversion': '0', 'version': '0.6.10'}, 'mac': {'name': 'TeXworks-macos11-0.6.10-x86_64-202502131354-git_7380941.dmg', 'type': 'application/x-apple-diskimage', 'size': 39467817, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.10/TeXworks-macos11-0.6.10-x86_64-202502131354-git_7380941.dmg', 'timestamp': '2025-02-13T20:17:44Z', 'minOSversion': '11', 'version': '0.6.10'}, 'win': {'name': 'TeXworks-win10-setup-0.6.10-202502131411-git_7380941.exe', 'type': 'application/x-msdownload', 'size': 27266529, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.10/TeXworks-win10-setup-0.6.10-202502131411-git_7380941.exe', 'timestamp': '2025-02-13T20:16:27Z', 'minOSversion': '10', 'version': '0.6.10'}}


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
    osName = "macOS";
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
// osName = "macOS";
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

function makeDownloadLink(release, osName, label) {
    "use strict";
    var html, m, info;

    if (label === undefined) {
        label = "Get TeXworks for " + osName;
    }

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
    if (release.minOSversion && release.minOSversion !== '0') {
        html += '<div class="info">requires ' + osName + ' &ge; ' + release.minOSversion + '</div>';
    }
    html += '</a>';
    return html;
}

function updateUi() {
    "use strict";
    var m, html, el;

    html = '';

    if (osType === "Windows" && releases.win !== undefined) {
        html = makeDownloadLink(releases.win, "Windows");
    }
    if (osType === "Mac" && releases.mac !== undefined) {
        html = makeDownloadLink(releases.mac, "macOS");
    }
    if (osType === "Linux") {
        if (osName === 'Ubuntu') {
            html = '<a href="https://launchpad.net/~texworks/+archive/stable/" class="link">Get TeXworks for Ubuntu</a>';
        }
        else if (osName === 'openSUSE') {
            html = '<a href="http://software.opensuse.org/search?q=texworks&baseproject=ALL&lang=en&exclude_debug=true" class="link">Get TeXworks for openSUSE</a>';
        }
        else if (osName === 'Debian') {
            html = '<a href="http://packages.debian.org/de/sid/texworks" class="link">Get TeXworks for Debian</a>';
        }
        else if (osName === 'Fedora') {
            html = '<a href="https://admin.fedoraproject.org/pkgdb/package/texworks/" class="link">Get TeXworks for Fedora</a>';
        }
        else {
            html = makeDownloadLink(releases.linux, "Linux", "Get TeXworks AppImage");
        }
    }

    if (html === '' && osType !== "Windows" && osType !== "Mac" && releases.src !== undefined) {
        // Fallback: Sources
        html = makeDownloadLink(releases.src, "", "Get TeXworks Sources");
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
    html += '<div class="other_ways">Not what you are looking for? Check <a href="#Getting_TeXworks">Getting TeXworks</a> for other versions and other ways to obtain TeXworks.</div>';

    el = document.getElementById("tw_downloads");
    el.innerHTML = html;
    el.parentNode.style.display = 'block';
}

updateUi();
