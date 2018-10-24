# 工作原理

这里展示了每个命令简化了的工作流程，方便理解其工作原理。



## mili init \<repository>

* git clone \<repository>
* 尝试获取template_path下的package.json
* 尝试获取package.json中main属性指定的入口文件
* 载入入口文件，得到模版相关的配置信息(template_config)。
* 遍历template_config.path指定的模版文件夹路径下的文件/文件夹。得到文件列表(file_list)。
* 将file_list与template_config.rules规则匹配，得到每个文件的复制方式。
* file_list中的文件复制到项目目录(如果有handler，会将handers处理完的内容复制到项目目录)
* 生成.milirc配置文件


## mili upgrade

* 从.milirc中获取当前模板的`repository`
* git clone \<repository>
* 尝试获取template_path下的package.json
* 尝试获取package.json中main属性指定的入口文件
* 载入入口文件，得到模版相关的配置信息(template_config)。
* 遍历template_config.path指定的模版文件夹路径下的文件/文件夹。得到文件列表(file_list)。
* 将file_list与template_config.rules规则匹配，得到每个文件的复制方式。
* 将file_list中upgrade类型为keep的文件删除
* file_list中的文件复制到项目目录(如果有handler，会将handers处理完的内容复制到项目目录)
* 生成.milirc配置文件


## mili update

* git clone \<repository>
* 将版本切换为最.milirc中指定的版本
* 尝试获取template_path下的package.json
* 尝试获取package.json中main属性指定的入口文件
* 载入入口文件，得到模版相关的配置信息(template_config)。
* 遍历template_config.path指定的模版文件夹路径下的文件/文件夹。得到文件列表(file_list)。
* 将file_list与template_config.rules规则匹配，得到每个文件的复制方式。
* 将file_list中upgrade类型为keep的文件删除
* file_list中的文件复制到项目目录(如果有handler，会将handers处理完的内容复制到项目目录)
* 生成.milirc配置文件
