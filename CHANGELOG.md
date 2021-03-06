# 1.4.1

- Removed redundant `updateEntity` from `ReactionSystem`

# 1.4.0

- Added `ReactionSystem`
- Documentation updated

# 1.3.0

- Fixed critical issue with updating of a `Query`. Queries whose predicates were a set of conditions that went beyond the capabilities of QueryBuilder could incorrectly evaluate the presence state for Entity after removing or adding components.   

# 1.2.7

- Fixed wrong type inference for `Entity#hasAll` and `Entity#hasAny`
- Added several utility methods for `Query`

# 1.2.6

- Added `first`, `last` and `length` getter for queries

# 1.2.5

- Added feature of invalidation entity and queries
- Fixed disconnecting of entities from engine

# 1.2.4

- Switched to commonjs modules

# 1.2.3

- Reverted `IterativeSystem#entities` remove
- Added `IterativeSystem#prepare` protected method, which will be invoked after adding iterative system to engine

# 1.2.2

- Added Entity#hasAny, Entity#hasAll methods
- Fixed throwing an error with passing invalid value to param `component` of `Entity#add` method
- Removed redundant `entities` getter from `IterativeSystem`

# 1.2.1

- Fixed bug with disconnecting from Entity events after remove from Engine. 
- Added utility methods for clearing `Engine`. 
  - `Engine#clear()`
  - `Engine#removeAllSystems()`
  - `Engine#removeAllQueries()`
  - `Engine#removeAllEntities()`

# 1.2.0
- Changed logic of resolving of component identifier. Changes could affect resolving of inherited components. Now inherited components will not be resolved as its ancestors.
- Added parameter for Entity#add "resolveClass" - which specifies how could be resolved component.
- Updated documentation
- Added tests for Query#isEmpty 

# 1.1.2
- Added Query#isEmpty property

# 1.1.1
- Added documentation

# 1.1.0
- Fixed query onEntityAdded, onEntityRemoved handlers
- Added entity snapshot for properly handling of the entity changes

# 1.0.7
- Fixed false-positive query trigger

# 1.0.6
- Switched library target to ES5

# 1.0.5
- Updated documentation for every core type
- Added guard that stops updating process for IterativeSystem, if it was removed engine
- Fixed order of dispatching and removing of the component. Now dispatching happens before removing.
- Added "get accessor" to query entities from Iterative system 

# 1.0.0
- Initial release

