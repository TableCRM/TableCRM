// react & redux
import React from 'react';
import { connect } from 'react-redux';
// styled-component
import styled from 'styled-components';
// ant ui
import 'antd/dist/antd.css';
import { Spin } from 'antd';

const InputTitle = styled.p`
	margin-bottom: 4px;
	color: #888;
`;

const InputWrap = styled.div`
	margin: 0 0 8px 0;
`;

const InputField = styled.input`
	border-radius: 2px;
	margin-bottom: 16px;
	font-size: 13px;
	color: #363636;
	border-bottom: 1px solid #ccc;
	width: 100%;
	max-width: 600px;
	padding: 0 0 5px 0;
	border-radius: 0;
	font-size: 14px;
	font-family: inherit;
	line-height: inherit;
	background-image: none;
	&:focus {
		border-bottom: 2px solid #3f51b5;
	}
`;

const Center = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

class AccountsRightPanelFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        {this.props.selectedAccount ? (
          this.props.selectedAccount.map(i => (
            <div key={Object.keys(i)[0]}>
              <InputTitle>{Object.keys(i)[0]}</InputTitle>
              <InputWrap>
                <InputField
                  className="field_input"
                  type="field"
                  placeholder=""
                  defaultValue={i[Object.keys(i)[0]]}
                  key={i[Object.keys(i)[0]]}
                  disabled
                />
              </InputWrap>
            </div>
          ))
        ) : (
					<Center>
						<Spin />
					</Center>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedAccount: state.accountsReducer.selectedAccount
});

export default connect(mapStateToProps, null)(AccountsRightPanelFields);
