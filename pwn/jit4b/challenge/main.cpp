/**
 * This code writes how you can get the flag.
 * MAYBE YOU SHOULD READ THIS CODE A BIT
 */
#include <algorithm>
#include <cmath>
#include <fstream>
#include <iostream>
#include <limits>
#include <vector>
#include "abstract.hpp"
#include "instruction.hpp"

using namespace std;

/* Append a calculation to your function */
bool build_function(vector<Inst*>& function)
{
  int choice, value;

  cout << "1:Add / 2:Sub / 3:Mul / 4:Div / 5:Min / 6:Max / Others:Exit" << endl
       << "> ";
  cin >> choice;
  if (choice < 1 || choice > 6)
    return false;

  cout << "value: ";
  cin >> value;

  switch (choice) {
  case 1: // Add
    function.push_back(new InstAdd(value));
    break;
  case 2: // Sub
    function.push_back(new InstSub(value));
    break;
  case 3: // Mul
    function.push_back(new InstMul(value));
    break;
  case 4: // Div
    function.push_back(new InstDiv(value));
    break;
  case 5: // Min
    function.push_back(new InstMin(value));
    break;
  case 6: // Max
    function.push_back(new InstMax(value));
    break;
  }

  return cin.good();
}

/* Print the function */
void show_function(vector<Inst*>& function)
{
  cout << "[+] Your function looks like this:" << endl << endl;
  cout << "function f(x) {" << endl
       << "  let arr = [3.14, 3.14, 3.14];" << endl;
  for (auto inst: function)
    cout << "  " << *inst << ";" << endl;
  cout << "  return arr[x];" << endl
       << "}" << endl << endl;
}

/* JIT determines if it can eliminate the bounds checking for `arr` */
bool optimize_for_arr(vector<Inst*>& function, Range &x_spec)
{
  /* Speculate the abstract value for `x` */
  for (auto inst: function) {
    cout << "[JIT] Speculation: " << x_spec << endl;
    cout << "[JIT] Applying [ " << *inst << " ]" << endl;
    inst->apply(x_spec);
  }

  /* Check if `x` can take out-of-bound index as its value */
  cout << "[JIT] CheckBound: 0 <= " << x_spec << " < 3?" << endl;
  if (0 <= x_spec && x_spec < 3) {
    cout << "      --> Yes. Eliminating bound check for performance." << endl << endl;
    return true;
  } else {
    cout << "      --> No. Keeping bound check for security." << endl << endl;
    return false;
  }
}

double call_f(vector<Inst*>& function, int x_real, bool eliminate)
{
  /* JIT recognizes this array is fixed, and thus knows its length is 3 */
  vector<double> arr = {3.14, 3.14, 3.14};

  /* Run your code */
  for (auto inst: function) {
    inst->apply(x_real);
  }

  /* Array access! */
  if (eliminate) {
    // FastPath: JIT determined check is not required
    return arr[x_real];
  } else {
    // SlowPath: JIT determined check is required
    try {
      return arr.at(x_real);
    } catch(...) {
      return numeric_limits<double>::quiet_NaN();
    }
  }
}

void jitpwn()
{
  vector<Inst*> function; // Your function to be JITted
  Range x_spec;          // Abstract value for `x`
  int x_real;            // Actual value for `x`

  /* 1. Define your function */
  cout << "Step 1. Build your function" << endl;
  while(build_function(function));
  show_function(function);

  /* 2. Optimize the function */
  cout << "Step 2. Optimize your function..." << endl;
  bool eliminate = optimize_for_arr(function, x_spec);

  /* 3. Call the optimized function */
  cout << "Step 3. Call your optimized function" << endl;
  cout << "What's the argument `x` passed to `f`?" << endl;
  cout << "x = ";
  cin >> x_real;
  if (!cin.good()) return;
  double result = call_f(function, x_real, eliminate);
  cout << "[+] f(" << x_real << ") --> ";
  if (isnan(result)) {
    cout << "undefined" << endl;
  } else {
    cout << result << endl;
  }

  /* 4. Did you cause out-of-bound access? */
  if (isnan(result) || result == 3.14) {
    cout << "[-] That's too ordinal..." << endl;
  } else {
    string flag;
    ifstream f("flag.txt");
    getline(f, flag);
    cout << "[+] Wow! You deceived the JIT compiler!" << endl;
    cout << "[+] " << flag << endl;
  }

  for (auto f: function)
    delete f;
}

int main()
{
  cout << "Today, let's learn about bounds-checking elimination bug!" << endl
       << "JIT is frequently abused in browser exploitation." << endl << endl;
  cout << "The JIT compiler is going to optimize the following function:" << endl << endl;
  cout << "1| function f(x) {" << endl
       << "2|   let arr = [3.14, 3.14, 3.14];" << endl
       << "3|   <YOUR CODE GOES HERE>" << endl
       << "4|   return arr[x];" << endl
       << "5| }" << endl << endl;
  cout << "You can apply some basic calculations on `x`, for example:" << endl << endl;
  cout << "1| function f(x) {" << endl
       << "2|   let arr = [3.14, 3.14, 3.14];" << endl
       << "3|   x = Math.min(x, 2);" << endl
       << "4|   x = Math.max(x, 0);" << endl
       << "5|   return arr[x];" << endl
       << "6| }" << endl << endl;
  cout << "In the code above, JIT will remove the bound check on line 5" << endl
       << "because JIT knows `x` is always in Range(0, 2)." << endl << endl;
  cout << "However, in the code below, JIT will not remove the bound check" << endl
       << "because the speculated range for `x` is Range(-inf, 2)," << endl
       << "which may cause (negative) out-of-bound access." << endl << endl;
  cout << "1| function f(x) {" << endl
       << "2|   let arr = [3.14, 3.14, 3.14];" << endl
       << "4|   x = x * 123;" << endl
       << "3|   x = Math.max(x, 2);" << endl
       << "5|   return arr[x];" << endl
       << "6| }" << endl << endl;
  cout << "Your goal is to deceive JIT speculation and access out-of-bound." << endl << endl;

  jitpwn(); // have a fun!
  return 0;
}
