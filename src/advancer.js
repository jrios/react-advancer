import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Advancer extends Component {
  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object).isRequired,
    stepSelector: PropTypes.func.isRequired,
    initialStep: PropTypes.object,
    render: PropTypes.func
  }

  constructor(props) {
    super(props);

    const { steps, initialStep, stepSelector } = this.props;
    const activeStep = initialStep || steps[0];
    const activeStepIndex = this.getIndexOfStep(activeStep);

    this.state = {
      previousStep: steps[activeStepIndex - 1],
      activeStep,
      nextStep: steps[activeStepIndex + 1]
    };
  }

  activateFirstStep = () => {
    this.setState(() => {
      const { steps } = this.props;

      return {
        previousStep: undefined,
        activeStep: steps[0],
        nextStep: steps[1]
      };
    });
  }

  activateLastStep = () => {
    this.setState(() => {
      const { steps } = this.props;
      const stepLength = steps.length;

      return {
        previousStep: steps[stepLength - 1],
        activeStep: steps[stepLength],
        nextStep: undefined
      };
    });
  }

  getIndexOfStep = stepToMatch => {
    const { steps, stepSelector } = this.props;
    return steps.findIndex(s => stepSelector(s) === stepSelector(stepToMatch));
  }

  activatePreviousStep = () => {
    this.setState(({ activeStep }) => {
      const { steps } = this.props;
      const newPreviousStep = activeStep;
      const currentStepIndex = this.getIndexOfStep(activeStep);

      return {
        previousStep: steps[currentStepIndex - 2],
        activeStep: steps[currentStepIndex - 1],
        nextStep: activeStep
      };
    });
  }

  activateNextStep = () => {
    this.setState(({ activeStep }) => {
      const { steps } = this.props;
      const currentStepIndex = this.getIndexOfStep(activeStep);

      return {
        previousStep: activeStep,
        activeStep: steps[currentStepIndex + 1],
        nextStep: steps[currentStepIndex + 2]
      };
    });
  }

  createStepActivator = stepSelector => {
    return () => {
      this.setState(() => {
        const { steps } = this.props;
        const foundStep = steps.find(stepSelector);
        const stepIndex = steps.indexOf(foundStep);

        return {
          previousStep: steps[stepIndex - 1],
          activeStep: foundStep,
          nextStep: steps[stepIndex + 1]
        };
      });
    }
  }

  getStepActions = () => {
    return {
      activateFirstStep: this.activateFirstStep,
      activateNextStep: this.activateNextStep,
      activatePreviousStep: this.activatePreviousStep,
      activateLastStep: this.activateLastStep,
      createStepActivator: this.createStepActivator
    };
  }

  getSteps = () => {
    return {
      previousStep: this.state.previousStep,
      activeStep: this.state.activeStep,
      nextStep: this.state.nextStep
    };
  }

  render() {
    return this.props.render({
      getSteps: this.getSteps,
      getStepActions: this.getStepActions
    });
  }
}
