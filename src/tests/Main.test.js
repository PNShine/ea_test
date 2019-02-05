import React from "react";
import Main from "../components/Main";
import Loader from "../components/Loader";
import renderer from "react-test-renderer";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });


test('Testing Main', () => {
    let component = renderer.create(<Main/>);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.update();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.update();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

//test if component exists/doesn't exist
test("This will fail as we dont have a component like this", () => {
    expect(mount(<Main />).contains(<div id="nonExistingCoomponent"></div>)).toBe(true);
});

// testing if children are present
test("check if loader has rendered", () => {
    expect(mount(<Main />).contains(<Loader/>)).toBe(true);
});

// testing if certain methods are called
test("Testing componentDidMount is called", () => {
    const spy = jest.spyOn(Main.prototype, 'componentDidMount');
    const wrapper = mount(<Main />);
    wrapper.instance().componentDidMount();
    expect(spy).toHaveBeenCalled();
});