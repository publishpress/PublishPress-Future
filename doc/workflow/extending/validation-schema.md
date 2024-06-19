The validation schema is evaluated and processed in design time. If the node validator finds any invalid setting or connection, it displays a warning icon in the node and an error message in the settings panel.

There are two groups of validations, both are optional: `connections` and `settings`.

# Validating Node Connections

For the group `connections`, we support the following rules:

- **hasIncomingConnection**: is valid when the node has any incoming connection:
- `["rule" => "hasIncomingConnection"]`
- **hasOutgoingConnection**: is valid when the node has any outgoing connection:
- `["rule" => "hasOutgoingConnection"]`
- **hasIncomerOfName**: is valid when the nodes tree is traversed from the current node until the first parent and any of the parent has the name specified by the property "name":
- `["rule" => "hasIncomerOfName", "name": "action/core.post-save"]`

The schema is:

```
[
  "<GROUP1_NAME>" => [
    "rules" => [
        [
           "rule" => "<RULE_NAME>",
           "settings" => "",
        ]
    ]
  ],
  "<GROUP2_NAME>" => [...]
]
```

# Validating Node Settings
