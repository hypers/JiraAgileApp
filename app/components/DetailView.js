
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  Button,
  Platform
} from 'react-native';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as allDataActionCreators from '../actions/allData';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/DetailView.style';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import LoadingView from './LoadingView';
import Spinner from 'react-native-loading-spinner-overlay';
import SvgUri from './SvgUri';

// import Detail from './Detail';
import Worklog from './Worklog';

import { Row, RowWithArrow, Header, SectionHeader, Line } from './common/List';
import { FabAddButton } from './common/Button';
import { FlexView } from './common/Layout';

const statusLabelColors = {
  '处理中': '#FFD065',
  '已解决': '#FFD065',
  'SELECTED FOR DEVELOPMENT': '#FFD065',
  'IN REVIEW': '#FFD065',
  '完成': '#008A39',
  '已关闭': '#008A39',
  '待办': '#476983',
  '开放': '#476983',
  '重新打开': '#476983',
  'BACKLOG': '#476983',
};

const statusTextColors = {
  '处理中': '#000000',
  '已解决': '#000000',
  'SELECTED FOR DEVELOPMENT': '#000000',
  'IN REVIEW': '#000000',
  '完成': '#ffffff',
  '已关闭': '#ffffff',
  '待办': '#ffffff',
  '开放': '#ffffff',
  '重新打开': '#ffffff',
  'BACKLOG': '#ffffff',
};


class DetailView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'detail',
      data: {}
    };
  }
  componentWillMount() {
    this.handelFetch();
  }

  handelFetch = () => {
    const { item, onFetchDetail } = this.props;
    onFetchDetail(item.key, (resp)=>{
      this.setState({
        data: resp
      });
    });
  }

  showWorkLog = () => {
    const { data } = this.state;
    Actions.worklog({
      data
    });
  }

  showWorkLogForm = () => {
    const { data } = this.state;
    Actions.worklogForm({
      title: `${data.fields.summary} / ${data.key}`,
      issueId: data.id
    });
  }

  renderIconAndText(uri, text) {
    return (
      <View style={styles.row}>
        <SvgUri source={{ uri }} style={styles.fieldIcon} width={12} height={12} />
        <Text style={styles.text}>
          {text}
        </Text>
      </View>
    );
  }

  render() {
    const { status } = this.props;
    const { data } = this.state;
    const fields = _.get(data, 'fields');

    const { messages: intlDict } = this.context.intl;
    return (
      <FlexView>
        <NavBar
          title={intlDict.detail}
          leftIcon='ios-arrow-back'
          onLeftIconPress={() => Actions.pop()}
        />
        <Header text={`${_.get(fields, 'summary') || ''} / ${_.get(data, 'key') || ''}`} />
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              onRefresh={this.handelFetch}
              refreshing={!fields}
            />
          }
        >
          <FlexView style={styles.scrollContent}>
            <SectionHeader text={intlDict.detail} />
            <Row label={intlDict.type}>
              {fields ? this.renderIconAndText(_.get(fields, 'issuetype.iconUrl'), _.get(data, 'fields.issuetype.name')) : null}
            </Row>
            <Line />
            <Row label={intlDict.priority}>
              {fields ? this.renderIconAndText(_.get(fields, 'priority.iconUrl'), _.get(data, 'fields.priority.name')) : null}
            </Row>
            <Line />
            <Row label={intlDict.status}>
              {fields ? (
                <View style={[{}, styles.statusLabel, {
                  backgroundColor: statusLabelColors[_.get(fields, 'status.name')],
                  borderColor: statusLabelColors[_.get(fields, 'status.name')],
                }]}>
                  <Text style={[styles.statusText, {
                    color: statusTextColors[_.get(fields, 'status.name')]
                  }]}>
                    {_.get(fields, 'status.name')}
                  </Text>
                </View>
              ) : null}
            </Row>
            {_.get(fields, 'versions.0') ? ([
              <Line key="line-1" />,
              <Row key="row-1" label="影响版本">
                <Text style={styles.text}>
                  {_.get(fields, 'versions.0.name')}
                </Text>
              </Row>
            ]) : null}

            {_.get(fields, 'fixVersions.0') ? ([
              <Line key="line-2" />,
              <Row key="row-2" label="修复的版本">
                <Text style={styles.text}>
                  {_.get(fields, 'fixVersions.0.name')}
                </Text>
              </Row>
            ]) : null}

            <SectionHeader text={intlDict.personnel} />
            <Row label={intlDict.creator}>
              <Text style={styles.text}>{_.get(fields, 'creator.displayName')}</Text>
            </Row>
            <Line />
            <Row label={intlDict.assignee}>
              <Text style={styles.text}>{_.get(fields, 'assignee.displayName')}</Text>
            </Row>
            <SectionHeader text={intlDict.description} />
            <SectionHeader text='活动日志' />
            <Row label={intlDict.comment}>
              <Text style={styles.text}>{`${_.get(fields, 'comment.total')} 条`}</Text>
            </Row>
            <Line />
            <RowWithArrow label={intlDict.worklog} onPress={this.showWorkLog}>
              <Text style={styles.text}>{`${_.get(fields, 'worklog.total')} 条`}</Text>

            </RowWithArrow>
          </FlexView>
        </ScrollView>
        <FabAddButton onPress={this.showWorkLogForm} />
      </FlexView>
    );
  }
};

DetailView.propTypes = {
  data: PropTypes.object
};

DetailView.contextTypes = {
  intl: PropTypes.object.isRequired
};

function mapDispatch2Props(dispatch) {
  const actions = bindActionCreators({
    ...allDataActionCreators
  }, dispatch);

  return {
    onFetchDetail: actions.fetchDetail,
  };
}


export default connect(null, mapDispatch2Props)(DetailView);
