import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { upperFirst, get } from 'lodash';
import { Table } from '@fashiontrade/wardrobe';
import Button from '../Button';
import WEEK_DAYS from '../../constants/WeekDays';
import { START_TIME, END_TIME } from '../../constants/TimeTypes';
import TimeField from './TimeField';

const TableHeader = styled(Table.Header)`
  background: #999 !important;
  color: #FFF;
`;

const TableRow = styled(Table.Row)`
  align-items: center;
`;

const TableCell = styled(Table.Cell)`
  padding: 10px 15px;
`;

const Label = styled('div')`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ScheduleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  margin: 0 auto;
  max-width: 100%;
  padding-top: 15px;
`;

const StyledTable = styled(Table)`
  flex-grow: 1;
`;

const ButtonWrapper = styled('div')`
  padding: 15px;
`;

class ScheduleForm extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      props: {
        schedule: props.schedule
      },
      schedule: props.schedule || this.generateEmptySchedule()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.schedule !== prevState.props.schedule) {
      return {
        props: {
          schedule: nextProps.schedule
        },
        schedule: nextProps.schedule
      }
    }
    return null;
  }

  generateEmptySchedule = () => (
    WEEK_DAYS.reduce((result, day) => ({
      ...result,
      [day]: {
        [START_TIME]: null,
        [END_TIME]: null
      }
    }), {})
  );

  handleTimeChange = (day, time, type) => {
    if (!time) {
      return;
    }
    const { schedule } = this.state;
    this.setState({
      schedule: {
        ...schedule,
        [day]: {
          ...schedule[day],
          [type]: time
        }
      }
    })
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.schedule);
  }

  render() {
    return (
      <ScheduleWrapper>
        <StyledTable layout={[0.1, 1, 1]}>
          <TableHeader>
            <TableCell>Day</TableCell>
            <TableCell>Start time</TableCell>
            <TableCell>End time</TableCell>
          </TableHeader>
          {
            WEEK_DAYS.map(day =>
              <TableRow key={`${day}-field`}>
                <TableCell><Label>{upperFirst(day.substr(0, 3))}</Label></TableCell>
                <TableCell>
                  <TimeField
                    onChange={(time) => this.handleTimeChange(day, time, START_TIME)}
                    appearance="start"
                    value={get(this.state, `schedule.${day}.${START_TIME}`)}
                  />
                </TableCell>
                <TableCell>
                  <TimeField
                    onChange={(time) => this.handleTimeChange(day, time, END_TIME)}
                    appearance="end"
                    value={get(this.state, `schedule.${day}.${END_TIME}`)}
                  />
                </TableCell>
              </TableRow>
            )
          }
        </StyledTable>
        <ButtonWrapper>
          <Button
            fluid
            color={this.props.theme.success}
            onClick={this.handleSubmit}
          >
            Save
          </Button>
        </ButtonWrapper>
      </ScheduleWrapper>
    );
  }
};

ScheduleForm.propTypes = {
  schedule: PropTypes.object,
  onSubmit: PropTypes.func,
  theme: PropTypes.object,
}

export default withTheme(ScheduleForm);
