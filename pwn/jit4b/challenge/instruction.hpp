/**
 * This code writes the normal (in C++) behavior for each instruction.
 * MAYBE YOU DON'T NEED TO READ THIS CODE
 */
#ifndef __INSTRUCTION_HPP
#define __INSTRUCTION_HPP
#include <iostream>
#include "abstract.hpp"

using namespace std;

class Inst {
public:
  Inst() {}
  Inst(int value): _value(value) {}
  int value() const { return _value; }
  virtual void apply(Range& x) {}
  virtual void apply(int& x) {}
  virtual void print(ostream& os) const {}
private:
  int _value;
};

ostream& operator<<(ostream& os, const Inst& inst) {
  inst.print(os);
  return os;
}

class InstAdd: public Inst {
  using Inst::Inst;
public:
  void apply(Range& x) { x += value(); }
  void apply(int& x)   { x += value(); }
  void print(ostream& os) const {
    os << "x += " << value();
  }
};

class InstSub: public Inst {
  using Inst::Inst;
public:
  void apply(Range& x) { x -= value(); }
  void apply(int& x)   { x -= value(); }
  void print(ostream& os) const {
    os << "x -= " << value();
  }
};

class InstMul: public Inst {
  using Inst::Inst;
public:
  void apply(Range& x) { x *= value(); }
  void apply(int& x)   { x *= value(); }
  void print(ostream& os) const {
    os << "x *= " << value();
  }
};

class InstDiv: public Inst {
  using Inst::Inst;
public:
  void apply(Range& x) { x /= value(); }
  void apply(int& x)   { x /= value(); }
  void print(ostream& os) const {
    os << "x /= " << value();
  }
};

class InstMin: public Inst {
  using Inst::Inst;
public:
  void apply(Range& x) { x.take_min(value()); }
  void apply(int& x)   { x = min(x, value()); }
  void print(ostream& os) const {
    os << "x = Math.min(x, " << value() << ")";
  }
};

class InstMax: public Inst {
  using Inst::Inst;
public:
  void apply(Range& x) { x.take_max(value()); }
  void apply(int& x)   { x = max(x, value()); }
  void print(ostream& os) const {
    os << "x = Math.max(x, " << value() << ")";
  }
};
#endif
