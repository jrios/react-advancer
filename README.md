## The problem

You need to manage a step-based workflow and you want to be able to move between steps. You also want the flexibility to be able to control the rendering of your steps.

## This solution

This is a component that manages the state of your steps while providing you the flexibility to render your workflow in any way that you need to. It uses a [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) to give you the flexibility you need to render your workflow without having to think about managing the state of which step is active.

## Installation

````bash
npm install --save react-advancer
````

## Usage

````javascript
import Advancer from 'react-advancer';

function SimpleWorkflow({ steps }) {
  return (
    <Advancer
      steps={steps}
      stepSelector={step => step.props.id}
      render={({ getSteps, getStepActions }) => {
          const { activatePreviousStep, activateNextStep } = getStepActions();
          const { previousStep, activeStep, nextStep } = getSteps();
          return (
            <div>
              {previousStep !== undefined ? <button onClick={activatePreviousStep}>Previous</button> : null}
              {React.cloneElement(activeStep)}
              {nextStep !== undefined ? <button onClick={activateNextStep}>Next</button> : null}
            </div>
          )}}
    />
  );
}

function App() {
  const steps = [
    <div id='step-1'>I am the first step</div>,
    <div id='step-2'>I am the second step</div>,
    <div id='step-3'>I am the third step</div>,
    <div id='step-4'>I am the fourth step</div>,
    <div id='step-5'>I am the fifth step</div>
  ];

  return <SimpleWorkflow steps={steps} />;
}
````

`Advancer` is the only component. It does not render anything itself. It calls the render function and renders that.

## Props

### steps
> `arrayOf(PropTypes.object)` | *required*

Pass an array of steps that will be used by the component to determine the previous, active, and next steps.

### stepSelector
> `PropTypes.func` | *required*

Pass a function to invoke on each step in the `steps` prop in order to find a match.

### initialStep
> `PropTypes.object`

The step that will be set as the first active step.

### render

> `PropTypes.func` | *required*

This is called with an object. Read more about the properties passed to the render function in the section "Render Function prop".

## Render Function prop

This is the function that will determine what to render based on the state of the `Advancer` component. The function is passed as the render prop `<Advancer steps={[...]} render={/* here */} />`.

### `getStepActions`

These are actions that can be invoked to change the state of the `Advancer` component

| property              | type                            | description                                                                                                 |
|----------------------	|--------------------------------	|------------------------------------------------------------------------------------------------------------	|
| activateFirstStep     | `function()`                    | Activate the first step in the workflow regardless of its current state                                  |
| activateLastStep      | `function()`                    | Activate the last step in the workflow regardless of its current state                                   |
| activatePreviousStep  | `function()`                    | Activate the previous step in the workflow. If there is no previous step to activate, this is a `noop`   |
| activateNextStep      | `function()`                    | Activate the next step in the workflow. If there is no next step to activate, this is a `noop`           |
| createStepActivator   | `function(selector: Function)`  | Activate a step based on the selector function                                                              |

### `getSteps`

These are the steps from the array that can be used within render

| property      | type                    | description                           |
|--------------	|------------------------	|--------------------------------------	|
| previousStep  | `object` / `undefined`  | The step that was previously active   |
| activeStep    | `object`                | The step that is currently active     |
| nextStep      | `object` / `undefined`  | The step that will be activated next  |


## Inspiration

The goal was to make a simple API for managing workflow states while still giving a lot of flexibility control to the users. The methods used in this project were inspired by [Kent C. Dodds](https://github.com/kentcdodds) and his work on the [downshift](https://github.com/paypal/downshift) project.


## License

MIT
