import json
try:
	# Python3
	from urllib.request import urlopen
except:
	# Python2
	from urllib2 import urlopen



fin = urlopen("https://api.github.com/repos/texworks/texworks/releases")
releases = json.loads(fin.read().decode('utf-8'))
fin.close()

files = {}

for release in releases:
    version = str(release["tag_name"].replace("release-", ""))

    if not 'src' in files:
        url = str('https://github.com/TeXworks/texworks/archive/%s.zip' % release['tag_name'])
        size = -1
        fin = urlopen(url)
        meta = fin.info()
        size = int(meta["Content-Length"])
        fin.close()

        files['src'] = {'name': str('texworks-%s.zip' % release['tag_name']),
                        'type': 'application/zip',
                        'size': size,
                        'url': url,
                        'timestamp': str(release['published_at']),
                        'version': version}

    for asset in release["assets"]:
        if asset['name'].endswith(".dmg"): osType = "osx"
        elif asset['name'].endswith(".exe"): osType = "win"
        else: continue
        if osType in files: continue
        files[osType] = {'name': str(asset['name']),
                         'type': str(asset["content_type"]),
                         'size': int(asset["size"]),
                         'url': str(asset["browser_download_url"]),
                         'timestamp': str(asset["updated_at"]),
                         'version': str(version)}
print(files)
