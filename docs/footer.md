
---------------------------------

![visitors](https://visitor-badge-reloaded.herokuapp.com/badge?page_id=thu-db.github.io/dbs-tutorial/{{ file.path }})

*<small>last update at: {{ timestamp[file.path].time }}</small>*

{% if authors %}
*<small>{{- "author" if authors.length == 1 else "authors" -}}: {{ authors | join(", ") }}</small>*
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
