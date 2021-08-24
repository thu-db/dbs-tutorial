
---------------------------------

<small>last update at: {{ file.mtime.toLocaleString("zh-cn", {hour12: false, timeZone: "Asia/Shanghai"}) }}</small>

{% if authors %}
<small>{{- "author" if authors.length == 1 else "authors" -}}: {{ authors | join(", ") }}</small>
{% endif %}


<script src="https://utteranc.es/client.js"
        repo="thu-db/dbs-tutorial"
        issue-term="pathname"
        label="comment"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>
