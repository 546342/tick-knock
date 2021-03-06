import {Entity, EntitySnapshot, getComponentId} from '../../src';

class Position {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

describe('Components id', () => {
  it('Getting component id without forcing of id creation returns undefined', () => {
    expect(getComponentId(
      class Test {
      },
    )).toBeUndefined();
  });

  it('Getting component id return equal values for same component twice', () => {
    class Test1 {
    }

    class Test2 {
    }

    expect(getComponentId(Test1, true))
      .toBe(getComponentId(Test1, true));

    expect(getComponentId(Test2, true))
      .toBe(getComponentId(Test2));
  });

  it('Getting components id returns different values', () => {
    class Test1 {
    }

    class Test2 {
    }

    const positionId = getComponentId(Test1, true);
    const viewId = getComponentId(Test2, true);

    expect(positionId).toBeDefined();
    expect(viewId).toBeDefined();

    expect(positionId == viewId).toBeFalsy();
  });
});

describe('Adding component', () => {
  it('Simple', () => {
    const entity = new Entity();
    let addedCount = 0;
    let removedCount = 0;

    expect(entity.has(Position)).toBe(false);

    const addedCallback = () => addedCount++;
    const removedCallback = () => removedCount++;
    entity.onComponentAdded.connect(addedCallback);
    entity.onComponentRemoved.connect(removedCallback);

    entity.add(new Position());

    entity.onComponentAdded.disconnect(addedCallback);
    entity.onComponentRemoved.disconnect(removedCallback);

    expect(entity.has(Position)).toBe(true);
    expect(addedCount).toBe(1);
    expect(removedCount).toBe(0);
  });

  it('Expect an error on adding invalid component', () => {
    const entity = new Entity();
    // @ts-ignore
    expect(() => entity.add()).toThrowError();
  });

  it('Adding component twice, must override previous component', () => {
    const entity = new Entity();
    let addedCount = 0;
    let removedCount = 0;

    const position1 = new Position(0, 0);
    const position2 = new Position(1, 1);

    const addedCallback = () => addedCount++;
    const removedCallback = () => removedCount++;
    entity.onComponentAdded.connect(addedCallback);
    entity.onComponentRemoved.connect(removedCallback);

    entity.add(position1);
    entity.add(position2);

    entity.onComponentAdded.disconnect(addedCallback);
    entity.onComponentRemoved.disconnect(removedCallback);

    expect(entity.get(Position)).toBe(position2);
    expect(entity.getAll().length).toBe(1);
    expect(addedCount).toBe(2);
    expect(removedCount).toBe(1);
  });

  describe('Adding component with \'resolve class\' ancestor', () => {
    class Ancestor {}

    class Descendant extends Ancestor {}

    class Descendant2 extends Ancestor {}

    const entity = new Entity();
    entity.add(new Descendant(), Ancestor);
    const id1 = getComponentId(Ancestor);
    const id2 = getComponentId(Descendant);

    expect(id1).not.toEqual(id2);

    expect(entity.has(Ancestor)).toBeTruthy();
    expect(entity.get(Ancestor)).toBeDefined();

    expect(entity.has(Descendant)).toBeFalsy();
    expect(entity.get(Descendant)).toBeUndefined();

    expect(entity.has(Descendant2)).toBeFalsy();
    expect(entity.get(Descendant2)).toBeUndefined();
  });

  it('Adding component with \'resolve class\' not ancestor', () => {
    class Ancestor {}

    class Descendant extends Ancestor {}

    class Other {}

    const entity = new Entity();
    expect(
      () => { entity.add(new Ancestor(), Descendant); },
    ).toThrow();

    expect(
      () => { entity.add(new Ancestor(), Other); },
    ).toThrow();

  });

  it('Adding component of type Ancestor should override component with \'resolve class\' Ancestor', () => {
    class Ancestor {}

    class Descendant extends Ancestor {}

    const entity = new Entity();
    const ancestor = new Ancestor();
    const descendant = new Descendant();
    entity.add(descendant, Ancestor);
    expect(entity.get(Ancestor)).toBe(descendant);

    entity.add(ancestor);
    expect(entity.has(Ancestor)).toBeTruthy();
    expect(entity.get(Ancestor)).toBe(ancestor);
  });

  it('Expected that hasAny returns true', () => {
    class Other {}

    const entity = new Entity();
    entity.add(new Position());
    expect(entity.hasAny(Other, Position)).toBeTruthy();
  });

  it('Expected that hasAny returns false', () => {
    class Other {}

    class A {}

    class B {}

    const entity = new Entity();
    entity.add(new A());
    entity.add(new B());
    expect(entity.hasAny(Other, Position)).toBeFalsy();
  });

  it('Expected that hasAll returns true', () => {
    class Other {}

    const entity = new Entity();
    entity.add(new Position());
    entity.add(new Other());
    expect(entity.hasAll(Other, Position)).toBeTruthy();
  });

  it('Expected that hasAll returns false', () => {
    class Other {}

    const entity = new Entity();
    entity.add(new Position());
    expect(entity.hasAll(Other, Position)).toBeFalsy();
  });
});

describe('Removing component', () => {
  it('Simple', () => {
    const entity = new Entity();
    const position = new Position(1, 1);

    let addedCount = 0;
    let removedCount = 0;

    const addedCallback = () => addedCount++;
    const removedCallback = () => removedCount++;
    entity.onComponentAdded.connect(addedCallback);
    entity.onComponentRemoved.connect(removedCallback);

    entity.add(position);
    const removedComponent = entity.remove(Position);

    entity.onComponentAdded.disconnect(addedCallback);
    entity.onComponentRemoved.disconnect(removedCallback);

    expect(entity.getAll().length).toBe(0);
    expect(addedCount).toBe(1);
    expect(removedCount).toBe(1);
    expect(removedComponent).toBeDefined();
    expect(removedComponent).toBe(position);
  });

  it('Removing absent component', () => {
    const entity = new Entity();

    let addedCount = 0;
    let removedCount = 0;

    const addedCallback = () => addedCount++;
    const removedCallback = () => removedCount++;
    entity.onComponentAdded.connect(addedCallback);
    entity.onComponentRemoved.connect(removedCallback);

    const removedComponent = entity.remove(Position);

    entity.onComponentAdded.disconnect(addedCallback);
    entity.onComponentRemoved.disconnect(removedCallback);

    expect(entity.getAll().length).toBe(0);
    expect(addedCount).toBe(0);
    expect(removedCount).toBe(0);
    expect(removedComponent).toBeUndefined();
  });
});

describe('Snapshot', () => {
  it('Expect undefined value (but not throwing an error) for getting component instance, if snapshot not initialized', () => {
    class Component {}

    const snapshot = new EntitySnapshot();
    expect(() => snapshot.get(Component)).not.toThrowError();
    expect(snapshot.get(Component)).toBeUndefined();
  });

  it('Expect undefined value for class that was not being initialized as component', () => {
    class Component {}

    class NotAComponent {}

    const entity = new Entity();
    entity.add(new Component());

    const snapshot = new EntitySnapshot();
    snapshot.takeSnapshot(entity, new Component());
    expect(() => snapshot.get(NotAComponent)).not.toThrowError();
    expect(snapshot.get(NotAComponent)).toBeUndefined();
  });
});