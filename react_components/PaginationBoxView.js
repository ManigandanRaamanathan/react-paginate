'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageView from './PageView';
import BreakView from './BreakView';
import { View, Text, TouchableOpacity } from "react-native";

export default class PaginationBoxView extends Component {
  static propTypes = {
    pageCount: PropTypes.number.isRequired,
    pageRangeDisplayed: PropTypes.number.isRequired,
    marginPagesDisplayed: PropTypes.number.isRequired,
    previousLabel: PropTypes.node,
    nextLabel: PropTypes.node,
    breakLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    hrefBuilder: PropTypes.func,
    onPageChange: PropTypes.func,
    initialPage: PropTypes.number,
    forcePage: PropTypes.number,
    disableInitialCallback: PropTypes.bool,
    containerStyle: PropTypes.object,
    pageContainer: PropTypes.object,
    pageText: PropTypes.object,
    selectedText: PropTypes.object,
    activeClassName: PropTypes.string,
    activeLinkClassName: PropTypes.string,
    previousClassName: PropTypes.string,
    nextClassName: PropTypes.string,
    previousLinkClassName: PropTypes.string,
    nextLinkClassName: PropTypes.string,
    disabledClassName: PropTypes.string,
    breakContainer: PropTypes.object,
    breakText: PropTypes.object,
    breakLinkClassName: PropTypes.string,
    extraAriaContext: PropTypes.string,
    ariaLabelBuilder: PropTypes.func,
    previousComponent: PropTypes.func,
    previousContainer: PropTypes.object,
    nextComponent: PropTypes.func,
    nextContainer: PropTypes.object
  };

  static defaultProps = {
    pageCount: 10,
    pageRangeDisplayed: 2,
    marginPagesDisplayed: 3,
    activeClassName: 'selected',
    previousClassName: 'previous',
    nextClassName: 'next',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    breakLabel: '...',
    disabledClassName: 'disabled',
    disableInitialCallback: false,
    initializeSelected: () => null,
    previousComponent: () => null,
    nextComponent: () => null,
    previousContainer: {},
    nextContainer: {}
  };

  constructor(props) {
    super(props);

    this.initializeSelected = this.initializeSelected.bind(this);

  }

  state = {
    selected: 0,
  };

  initializeSelected = () => {
    const props = this.props;

    let initialSelected;
    if (props.initialPage) {
      initialSelected = props.initialPage;
    } else if (props.forcePage) {
      initialSelected = props.forcePage;
    } else {
      initialSelected = 0;
    }

    this.setState({
      selected: initialSelected
    })
  }

  componentDidMount() {
    this.props.initializeSelected(this.initializeSelected);

    const {
      initialPage,
      disableInitialCallback,
      extraAriaContext,
    } = this.props;

    this.initializeSelected();

    // Call the callback with the initialPage item:
    if (typeof initialPage !== 'undefined' && !disableInitialCallback) {
      this.callCallback(initialPage);
    }

    if (extraAriaContext) {
      console.warn(
        'DEPRECATED (react-paginate): The extraAriaContext prop is deprecated. You should now use the ariaLabelBuilder instead.'
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.forcePage !== 'undefined' &&
      this.props.forcePage !== nextProps.forcePage
    ) {
      this.setState({ selected: nextProps.forcePage });
    }
  }

  handlePreviousPage = evt => {
    const { selected } = this.state;
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    if (selected > 0) {
      this.handlePageSelected(selected - 1, evt);
    }
  };

  handleNextPage = evt => {
    const { selected } = this.state;
    const { pageCount } = this.props;

    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    if (selected < pageCount - 1) {
      this.handlePageSelected(selected + 1, evt);
    }
  };

  handlePageSelected = (selected, evt) => {
    // console.warn('handlePageSelected selected:'+selected+' evt:'+evt);

    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);

    if (this.state.selected === selected) return;

    this.setState({ selected: selected });

    // Call the callback with the new selected item:
    this.callCallback(selected);
  };

  getForwardJump() {
    const { selected } = this.state;
    const { pageCount, pageRangeDisplayed } = this.props;

    const forwardJump = selected + pageRangeDisplayed;
    return forwardJump >= pageCount ? pageCount - 1 : forwardJump;
  }

  getBackwardJump() {
    const { selected } = this.state;
    const { pageRangeDisplayed } = this.props;

    const backwardJump = selected - pageRangeDisplayed;
    return backwardJump < 0 ? 0 : backwardJump;
  }

  handleBreakClick = (index, evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);

    const { selected } = this.state;

    this.handlePageSelected(
      selected < index ? this.getForwardJump() : this.getBackwardJump(),
      evt
    );
  };

  hrefBuilder(pageIndex) {
    const { hrefBuilder, pageCount } = this.props;
    if (
      hrefBuilder &&
      pageIndex !== this.state.selected &&
      pageIndex >= 0 &&
      pageIndex < pageCount
    ) {
      return hrefBuilder(pageIndex + 1);
    }
  }

  ariaLabelBuilder(pageIndex) {
    const selected = pageIndex === this.state.selected;
    if (
      this.props.ariaLabelBuilder &&
      pageIndex >= 0 &&
      pageIndex < this.props.pageCount
    ) {
      let label = this.props.ariaLabelBuilder(pageIndex + 1, selected);
      // DEPRECATED: The extraAriaContext prop was used to add additional context
      // to the aria-label. Users should now use the ariaLabelBuilder instead.
      if (this.props.extraAriaContext && !selected) {
        label = label + ' ' + this.props.extraAriaContext;
      }
      return label;
    }
  }

  callCallback = selectedItem => {
    if (
      typeof this.props.onPageChange !== 'undefined' &&
      typeof this.props.onPageChange === 'function'
    ) {
      this.props.onPageChange({ selected: selectedItem });
    }
  };

  getPageElement(index) {
    const { selected } = this.state;
    const {
      pageContainer,
      pageText,
      selectedText,
      activeClassName,
      activeLinkClassName,
      extraAriaContext,
    } = this.props;

    return (
      <PageView
        key={index}
        onPress={this.handlePageSelected.bind(null, index)}
        selected={selected} //selected === index
        pageContainer={pageContainer}
        pageText={pageText}
        selectedText={selectedText}
        activeClassName={activeClassName}
        activeLinkClassName={activeLinkClassName}
        extraAriaContext={extraAriaContext}
        href={this.hrefBuilder(index)}
        ariaLabel={this.ariaLabelBuilder(index)}
        page={index + 1}
      />
    );
  }

  pagination = () => {
    const items = [];
    const {
      pageRangeDisplayed,
      pageCount,
      marginPagesDisplayed,
      breakLabel,
      breakContainer,
      breakText,
      breakLinkClassName,
    } = this.props;

    const { selected } = this.state;

    if (pageCount <= pageRangeDisplayed) {
      for (let index = 0; index < pageCount; index++) {
        items.push(this.getPageElement(index));
      }
    } else {
      let leftSide = pageRangeDisplayed / 2;
      let rightSide = pageRangeDisplayed - leftSide;

      // If the selected page index is on the default right side of the pagination,
      // we consider that the new right side is made up of it (= only one break element).
      // If the selected page index is on the default left side of the pagination,
      // we consider that the new left side is made up of it (= only one break element).
      if (selected > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - selected;
        leftSide = pageRangeDisplayed - rightSide;
      } else if (selected < pageRangeDisplayed / 2) {
        leftSide = selected;
        rightSide = pageRangeDisplayed - leftSide;
      }

      let index;
      let page;
      let breakView;
      let createPageView = index => this.getPageElement(index);

      for (index = 0; index < pageCount; index++) {
        page = index + 1;

        // If the page index is lower than the margin defined,
        // the page has to be displayed on the left side of
        // the pagination.
        if (page <= marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        // If the page index is greater than the page count
        // minus the margin defined, the page has to be
        // displayed on the right side of the pagination.
        if (page > pageCount - marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        // If the page index is near the selected page index
        // and inside the defined range (pageRangeDisplayed)
        // we have to display it (it will create the center
        // part of the pagination).
        if (index >= selected - leftSide && index <= selected + rightSide) {
          items.push(createPageView(index));
          continue;
        }

        // If the page index doesn't meet any of the conditions above,
        // we check if the last item of the current "items" array
        // is a break element. If not, we add a break element, else,
        // we do nothing (because we don't want to display the page).
        if (breakLabel && items[items.length - 1] !== breakView) {
          breakView = (
            <BreakView
              key={index}
              breakLabel={breakLabel}
              breakContainer={breakContainer}
              breakText={breakText}
              breakLinkClassName={breakLinkClassName}
              onPress={this.handleBreakClick.bind(null, index)}
            />
          );
          items.push(breakView);
        }
      }
    }

    return items;
  };

  render() {
    const {
      disabledClassName,
      previousClassName,
      nextClassName,
      pageCount,
      containerStyle,
      previousLinkClassName,
      previousLabel,
      previousComponent,
      nextLinkClassName,
      nextLabel,
      nextComponent,
      previousContainer,
      nextContainer
    } = this.props;

    const { selected } = this.state;

    // const previousContainer =
    //   previousClassName + (selected === 0 ? ` ${disabledClassName}` : '');
    // const nextContainer =
    //   nextClassName +
    //   (selected === pageCount - 1 ? ` ${disabledClassName}` : '');

    const previousAriaDisabled = selected === 0 ? 'true' : 'false';
    const nextAriaDisabled = selected === pageCount - 1 ? 'true' : 'false';

    return (
      <View style={[{flexDirection: 'row', flex: 1}, containerStyle]}>
        <View style={[{justifyContent: 'flex-start'}, previousContainer]}>
          <TouchableOpacity
            onPress={this.handlePreviousPage}
            href={this.hrefBuilder(selected - 1)}
            aria-disabled={previousAriaDisabled}
          >
            {previousComponent()? previousComponent() : <Text>{previousLabel}</Text>}
          </TouchableOpacity>
        </View>

        {this.pagination()}

        <View style={[{justifyContent: 'flex-end'}, nextContainer]}>
          <TouchableOpacity
            onPress={this.handleNextPage}
            href={this.hrefBuilder(selected + 1)}
            tabIndex="0"
            role="button"
            aria-disabled={nextAriaDisabled}
          >
            {nextComponent()? nextComponent() : <Text>{nextLabel}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
