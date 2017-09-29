import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

import Advancer from './advancer';

const steps = [
  <div id='step-1'>I am the first step</div>,
  <div id='step-2'>I am the second step</div>,
  <div id='step-3'>I am the third step</div>,
  <div id='step-4'>I am the fourth step</div>,
  <div id='step-5'>I am the fifth step</div>,
];

test('render receives the getSteps function passed to it', () => {
  const tree = ReactTestRenderer.create(
    <Advancer
      steps={steps}
      stepSelector={s => s.props.id}
      render={({ getSteps} ) => (
        <div>
          {[...getSteps()].map(step => React.cloneElement(step, { key: step.props.id }))}
        </div>
      )}
    />
  );

  expect(tree.toJSON()).toMatchSnapshot();
});

test('the active step will be the first step if no selector is passed', () => {
  const wrapper = setup();

  expect(wrapper.state('activeStep')).toBe(steps[0]);
});

test('the active step still will be the same as the passed initialStep prop', () => {
  const wrapper = setup({ initialStep: steps[2] });

  expect(wrapper.state('activeStep')).toBe(steps[2]);
});

test('the previous step will be undefined if no initialStep prop is passed', () => {
  const wrapper = setup();

  expect(wrapper.state('previousStep')).toBeUndefined();
});

test('the previous step will not be undefined if an initial step other than the first step is passed', () => {
  const wrapper = setup({ initialStep: steps[2] });

  expect(wrapper.state('previousStep')).toBe(steps[1]);
});

test('the next step will be the second step if no selector is passed', () => {
  const wrapper = setup();

  expect(wrapper.state('nextStep')).toBe(steps[1]);
});

test('the next step will be the next step when a selector is passed', () => {
  const wrapper = setup({ initialStep: steps[1] });

  expect(wrapper.state('nextStep')).toBe(steps[2]);
});

test('the next step will be undefined if a selector is passed and the active step is the last step', () => {
  const wrapper = setup({ initialStep: steps[4] });

  expect(wrapper.state('nextStep')).toBeUndefined();
});

describe('getStepActions', () => {
  test('activateFirstStep will set the step states appropriately', () => {
    const render = ({ getStepActions }) => {
      const { activateFirstStep } = getStepActions();
      return (
        <div>
          <button id="activate-first" onClick={activateFirstStep}>Go to first step</button>
        </div>
      );
    };

    const wrapper = setup({ render, initialStep: steps[2] });

    wrapper.find('#activate-first').simulate('click');

    expect(wrapper.state('activeStep')).toBe(steps[0]);
    expect(wrapper.state('previousStep')).toBeUndefined();
    expect(wrapper.state('nextStep')).toBe(steps[1]);
  });

  test('activateLastStep will set the step states appropriately', () => {
    const render = ({ getStepActions }) => {
      const { activateLastStep } = getStepActions();
      return (
        <div>
          <button id="activate-last" onClick={activateLastStep}>Go to last step</button>
        </div>
      );
    };

    const wrapper = setup({ render, intitialStep: steps[2] });

    wrapper.find('#activate-last').simulate('click');

    expect(wrapper.state('activeStep')).toBe(steps[steps.length]);
    expect(wrapper.state('previousStep')).toBe(steps[steps.length - 1])
    expect(wrapper.state('nextStep')).toBeUndefined();
   });

  test('createStepActivator will set the step states appropriately', () => {
    const render = ({ getStepActions }) => {
      const { createStepActivator } = getStepActions();
      const activateStep = createStepActivator(step => step.props.id === 'step-3');

      return (
        <div>
          <button id="activate-specific" onClick={activateStep}>Go to specific step</button>
        </div>
      );
    };

    const wrapper = setup({ render, initialStep: steps[2] });

    wrapper.find('#activate-specific').simulate('click');

    expect(wrapper.state('activeStep')).toBe(steps[2]);
    expect(wrapper.state('previousStep')).toBe(steps[1])
    expect(wrapper.state('nextStep')).toBe(steps[3]);
  });

  test('activateNextStep will set the step states appropriately', () => {
    const render = ({ getStepActions }) => {
      const { activateNextStep } = getStepActions();
      return (
        <div>
          <button id="activate-next" onClick={activateNextStep}>Go to next step</button>
        </div>
      );
    };

    const wrapper = setup({ render });

    wrapper.find('#activate-next').simulate('click');

    expect(wrapper.state('activeStep')).toBe(steps[1]);
    expect(wrapper.state('previousStep')).toBe(steps[0])
    expect(wrapper.state('nextStep')).toBe(steps[2]);
  });

  test('activatePreviousStep will set the step states appropriately', () => {
    const render = ({ steps, getStepActions }) => {
      const { activatePreviousStep } = getStepActions();
      return (
        <div>
          <button id="activate-previous" onClick={activatePreviousStep}>Go to previous step</button>
        </div>
      );
    };

    const wrapper = setup({ initialStep: steps[2], render });

    wrapper.find('#activate-previous').simulate('click');

    expect(wrapper.state('activeStep')).toBe(steps[1]);
    expect(wrapper.state('previousStep')).toBe(steps[0])
    expect(wrapper.state('nextStep')).toBe(steps[2]);
  });
});

function setup(props = {}) {
  const render = props.render !== undefined ? props.render : () => <div>test</div>;
  return mount(
    <Advancer
      steps={steps}
      stepSelector={s => s.props.id}
      {...props}
      render={render}
    />
  );
}
