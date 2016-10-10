# R3alB0t
<img src="https://travis-ci.org/R3alCl0ud/R3alB0t.svg?branch=master"> </img>

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
<a name="new_Command_new"></a>

### new Command(ID, function|string|falsy, parent, options)

| Param | Type | Description |
| --- | --- | --- |
| ID | <code>string</code> | The ID of the command |
| function|string|falsy | <code>MessageGenerator</code> |  |
| parent | <code>ParentObject</code> | This can be a guild, plugin. This should be a command if you are registering a SubCommand. |
| options | <code>[CommandOptions](#CommandOptions)</code> |  |

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

