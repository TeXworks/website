import json, urllib2

fin = urllib2.urlopen("https://api.github.com/repos/texworks/texworks/releases")
releases = json.load(fin)
fin.close()

#with open("files.json", 'r') as fin:
#    releases = json.load(fin)

#with open("files.json", 'w') as fout:
#    json.dump(releases, fout, indent = 4)

files = {}

for release in releases:
    version = release["tag_name"].replace("release-", "").encode('utf-8')

    if not 'src' in files:
        url = ('https://github.com/TeXworks/texworks/archive/%s.zip' % release['tag_name']).encode('utf-8')
        size = -1
        fin = urllib2.urlopen(url)
        meta = fin.info()
        size = int(meta.getheaders("Content-Length")[0])
        fin.close()

        files['src'] = {'name': ('texworks-%s.zip' % release['tag_name']).encode('utf-8'),
                        'type': 'application/zip',
                        'size': size,
                        'url': url,
                        'timestamp': release['published_at'].encode('utf-8'),
                        'version': version}

    for asset in release["assets"]:
        if asset['name'].endswith(".dmg"): osType = "osx"
        elif asset['name'].endswith(".exe"): osType = "win"
        else: continue
        if osType in files: continue
        files[osType] = {'name': asset['name'].encode('utf-8'),
                         'type': asset["content_type"].encode('utf-8'),
                         'size': asset["size"],
                         'url': asset["browser_download_url"].encode('utf-8'),
                         'timestamp': asset["updated_at"].encode('utf-8'),
                         'version': version}
print(files)
