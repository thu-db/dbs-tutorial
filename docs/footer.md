
---------------------------------

<small>last update at: {{ file.mtime.toLocaleString("zh-cn", {hour12: false, timeZone: "Asia/Shanghai"}) }}</small>

{% if authors %}
<small>{{- "author" if authors.length == 1 else "authors" -}}: {{ authors | join(", ") }}</small>
{% endif %}

<div id="my-comment">
<script>
        var discussion = document.getElementById('my-comment');
        var script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'thu-db/dbs-tutorial');
        script.setAttribute('issue-term', "pathname");
        script.setAttribute('theme', 'github-light');
        script.setAttribute('crossorigin', 'anonymous');
        discussion.appendChild(script);
</script>
</div>
