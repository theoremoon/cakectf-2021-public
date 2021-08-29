/**
 * This code writes the behavior of the JIT speculation.
 * MAYBE YOU SHOULD CAREFULLY READ THIS CODE
 */
#ifndef __ABSTRACT_HPP
#define __ABSTRACT_HPP
#include <limits>
#include <iostream>

using namespace std;

/**
 * Abstract value used by JIT for speculation
 */
class Range {
public:
  int min;
  int max;
  Range() : min(numeric_limits<int>::min()),
            max(numeric_limits<int>::max()) {};
  friend ostream& operator<<(ostream& os, const Range& range) {
    os << "Range(" << range.min << ", " << range.max << ")";
  }

  /* Abstract addition */
  Range& operator+=(const int& rhs) {
    if (__builtin_sadd_overflow(min, rhs, &min)
        || __builtin_sadd_overflow(max, rhs, &max)) {
      // Integer overflow may happen
      min = numeric_limits<int>::min();
      max = numeric_limits<int>::max();
    }
    return *this;
  }

  /* Abstract subtraction */
  Range& operator-=(const int& rhs) {
    if (__builtin_ssub_overflow(min, rhs, &min)
        || __builtin_ssub_overflow(max, rhs, &max)) {
      // Integer overflow may happen
      min = numeric_limits<int>::min();
      max = numeric_limits<int>::max();
    }
    return *this;
  }

  /* Abstract multiplication */
  Range& operator*=(const int& rhs) {
    if (rhs < 0)
      swap(min, max);
    if (__builtin_smul_overflow(min, rhs, &min)
        || __builtin_smul_overflow(max, rhs, &max)) {
      // Integer overflow may happen
      min = numeric_limits<int>::min();
      max = numeric_limits<int>::max();
    }
    return *this;
  }

  /* Abstract divition */
  Range& operator/=(const int& rhs) {
    if (rhs < 0)
      *this *= -1; // This swaps min and max properly
    // There's no function named "__builtin_sdiv_overflow"
    // (Integer overflow never happens by integer division!)
    min /= abs(rhs);
    max /= abs(rhs);
    return *this;
  }

  /* Abstract min */
  void take_min(const int& value) {
    if (max > value)
      max = value;
    if (min > value)
      min = value;
  }

  /* Abstract max */
  void take_max(const int& value) {
    if (max < value)
      max = value;
    if (min < value)
      min = value;
  }
};

inline bool operator<=(const int& lhs, const Range& rhs) {
  return lhs <= rhs.min;
}
inline bool operator<(const Range& lhs, const int& rhs) {
  return lhs.max < rhs;
}
#endif
