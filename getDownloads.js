var osType, osName, osVersion, userAgent, appVersion;

var releases = {'src': {'name': 'texworks-release-0.6.8.zip', 'type': 'application/zip', 'size': 12930941, 'url': 'https://github.com/TeXworks/texworks/archive/release-0.6.8.zip', 'timestamp': '2023-02-18T14:35:47Z', 'version': '0.6.8'}, 'linux': {'name': 'TeXworks-0.6.8-x86_64.AppImage', 'type': 'application/vnd.appimage', 'size': 41940160, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.8/TeXworks-0.6.8-x86_64.AppImage', 'timestamp': '2023-02-18T16:10:55Z', 'version': '0.6.8'}, 'mac': {'name': 'TeXworks-macos10.15-0.6.8-202302181247-git_6b1c6ab.dmg', 'type': 'application/x-apple-diskimage', 'size': 36975080, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.8/TeXworks-macos10.15-0.6.8-202302181247-git_6b1c6ab.dmg', 'timestamp': '2023-02-18T14:28:41Z', 'version': '0.6.8'}, 'win': {'name': 'TeXworks-win10-setup-0.6.8-202302181302-git_6b1c6ab.exe', 'type': 'application/x-ms-dos-executable', 'size': 23746856, 'url': 'https://github.com/TeXworks/texworks/releases/download/release-0.6.8/TeXworks-win10-setup-0.6.8-202302181302-git_6b1c6ab.exe', 'timestamp': '2023-02-18T14:27:58Z', 'version': '0.6.8'}}


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
    if (osType === "Mac" && releases.mac !== undefined) {
        html = makeDownloadLink(releases.mac, "Get TeXworks for macOS");
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
            html = makeDownloadLink(releases.linux, "Get TeXworks AppImage");
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
