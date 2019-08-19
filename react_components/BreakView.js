'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from "react-native";

const BreakView = props => {
  const { breakLabel, breakContainer, breakText, onPress } = props;
  const className = breakContainer || {};

  return (
    <View style={className}>
      <TouchableOpacity
        onPress={onPress}
      >
        <Text style={breakText} >
          {breakLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

BreakView.propTypes = {
  breakLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  breakContainer: PropTypes.object,
  breakText: PropTypes.object,
  breakLinkClassName: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

export default BreakView;
