## Classes

<dl>
<dt><a href="#CommandRegistry">CommandRegistry</a></dt>
<dd><p>This is the CommandRegistry holds all of the commands in the world</p>
</dd>
<dt><a href="#chatHandler">chatHandler</a></dt>
<dd><p>This is the chat handling class file. This is the command running code. Very finiky</p>
</dd>
<dt><a href="#Command">Command</a></dt>
<dd><p>The Command Object</p>
</dd>
<dt><a href="#Plugin">Plugin</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CommandOptions">CommandOptions</a> : <code>Object</code></dt>
<dd><p>Options to be passed to used in a command</p>
</dd>
</dl>

<a name="CommandRegistry"></a>

## CommandRegistry
This is the CommandRegistry holds all of the commands in the world

**Kind**: global class  
<a name="chatHandler"></a>

## chatHandler
This is the chat handling class file. This is the command running code. Very finiky

**Kind**: global class  
<a name="Command"></a>

## Command
The Command Object

**Kind**: global class  

* [Command](#Command)
    * [new Command(ID, function|string|falsy, parent, options)](#new_Command_new)
    * [.Parent](#Command+Parent) : <code>[Plugin](#Plugin)</code> &#124; <code>[Command](#Command)</code> &#124; <code>Guild</code>
    * [._id](#Command+_id) : <code>string</code>
    * [.caseSensitive](#Command+caseSensitive) : <code>boolean</code>
    * [.dmOnly](#Command+dmOnly) : <code>boolean</code>
    * [.guildOnly](#Command+guildOnly) : <code>boolean</code>
    * [.description](#Command+description) : <code>string</code>
    * [.usage](#Command+usage) : <code>string</code>
    * [.names](#Command+names) : <code>Array</code>

<a name="new_Command_new"></a>

### new Command(ID, function|string|falsy, parent, options)

| Param | Type | Description |
| --- | --- | --- |
| ID | <code>string</code> | The ID of the command |
| function|string|falsy | <code>MessageGenerator</code> |  |
| parent | <code>ParentObject</code> | This can be a guild, plugin. This should be a command if you are registering a SubCommand. |
| options | <code>[CommandOptions](#CommandOptions)</code> |  |

<a name="Command+Parent"></a>

### command.Parent : <code>[Plugin](#Plugin)</code> &#124; <code>[Command](#Command)</code> &#124; <code>Guild</code>
The Parent of the command

**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+_id"></a>

### command._id : <code>string</code>
The ID of the command

**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+caseSensitive"></a>

### command.caseSensitive : <code>boolean</code>
**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+dmOnly"></a>

### command.dmOnly : <code>boolean</code>
**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+guildOnly"></a>

### command.guildOnly : <code>boolean</code>
**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+description"></a>

### command.description : <code>string</code>
The description of the command

**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+usage"></a>

### command.usage : <code>string</code>
The usage of the command

**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Command+names"></a>

### command.names : <code>Array</code>
The aliases of the command

**Kind**: instance property of <code>[Command](#Command)</code>  
<a name="Plugin"></a>

## Plugin
**Kind**: global class  
<a name="new_Plugin_new"></a>

### new Plugin(ID, [Name], [Author], [Version], [Description])

| Param | Type | Description |
| --- | --- | --- |
| ID | <code>string</code> &#124; <code>object</code> | The ID of the Plugin |
| [Name] | <code>string</code> | The name of the Plugin |
| [Author] | <code>string</code> | The author of the plugin |
| [Version] | <code>string</code> | The version of the plugin |
| [Description] | <code>string</code> | The description of the plugin |

<a name="CommandOptions"></a>

## CommandOptions : <code>Object</code>
Options to be passed to used in a command

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| caseSensitive | <code>boolean</code> | <code>true</code> | Whether or not the command should be case sensitive |
| dmOnly | <code>boolean</code> | <code>false</code> | Whether or not the command can only be ran in direct messages only |
| guildOnly | <code>boolean</code> | <code>false</code> | Whether or not the command can only be ran in a guild text channel. Cannot be true if dmOnly is true |
| description | <code>string</code> | <code>&quot;Default Description&quot;</code> | The description of the command |
| usage | <code>string</code> | <code>&quot;command ID&quot;</code> | The usage for the command |

