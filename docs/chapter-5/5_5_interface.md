#### 5.5 对外提供的接口
1. pa::parse() // 词法语法分析：SQL语句到抽象语法树
2. pa::logic() // 逻辑优化：抽象语法树到逻辑计划树
3. pa::physic() // 物理优化：逻辑计划树到物理执行计划

{% set authors = ["董昊文"] %}
{% include "/footer.md" %}