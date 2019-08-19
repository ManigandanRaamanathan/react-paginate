'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from "react-native";

const PageView = props => {
  let pageContainer = props.pageContainer;
  let pageText = props.pageText;

  const onPress = props.onPress;
  const href = props.href;
  let ariaLabel =
    props.ariaLabel ||
    'Page ' +
      props.page +
      (props.extraAriaContext ? ' ' + props.extraAriaContext : '');
  let ariaCurrent = null;

  if (props.selected) {
    ariaCurrent = 'page';

    ariaLabel =
      props.ariaLabel || 'Page ' + props.page + ' is your current page';

    if (typeof pageContainer !== 'undefined') {
      pageContainer = pageContainer + ' ' + props.activeClassName;
    } else {
      pageContainer = props.activeClassName;
    }

    if (typeof pageText !== 'undefined') {
      if (typeof props.activeLinkClassName !== 'undefined') {
        pageText = pageText + ' ' + props.activeLinkClassName;
      }
    } else {
      pageText = props.activeLinkClassName;
    }
  }

  return (
    <View style={props.pageContainer}>
      <TouchableOpacity
        onPress={onPress}
        href={href}
      >
        <Text style={[pageText, (props.selected+1) == props.page? props.selectedText: {}]}>{props.page}</Text>
      </TouchableOpacity>
    </View>
  );
};

PageView.propTypes = {
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.number,
  pageContainer: PropTypes.object,
  pageText: PropTypes.object,
  selectedText: PropTypes.object,
  activeClassName: PropTypes.string,
  activeLinkClassName: PropTypes.string,
  extraAriaContext: PropTypes.string,
  href: PropTypes.string,
  ariaLabel: PropTypes.string,
  page: PropTypes.number.isRequired,
};

export default PageView;
