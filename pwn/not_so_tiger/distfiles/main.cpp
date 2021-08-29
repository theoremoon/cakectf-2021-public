#include <iostream>
#include <variant>
#include <iomanip>
#include <cstring>

using namespace std;

class Bengal {
public:
  Bengal(long _age, const char *_name) { set(_age, _name); }
  void set(long _age, const char *_name) {
    age = _age;
    name = strdup(_name);
  }
  char *name;
  long age;
};

class Ocicat {
public:
  Ocicat(long _age, const char *_name) { set(_age, _name); }
  void set(long _age, const char *_name) {
    age = _age;
    strcpy(name, _name);
  }
  char name[0x20];
  long age;
};

class Ocelot {
public:
  Ocelot(long _age, const char *_name) { set(_age, _name); }
  void set(long _age, const char *_name) {
    age = _age;
    strcpy(name, _name);
  }
  long age;
  char name[0x20];
};

class Savannah {
public:
  Savannah(long _age, const char *_name) { set(_age, _name); }
  void set(long _age, const char *_name) {
    age = _age;
    name = strdup(_name);
  }
  long age;
  char *name;
};

int main()
{
  setvbuf(stdin, NULL, _IONBF, 0);
  setvbuf(stdout, NULL, _IONBF, 0);
  variant<Bengal, Ocicat, Ocelot, Savannah> cat = Bengal(97, "Nyanchu");

  while (cin.good()) {
    int choice;
    cout << "1. New cat" << endl
         << "2. Get cat" << endl
         << "3. Set cat" << endl
         << ">> ";
    cin >> choice;

    switch (choice) {
    case 1: { /* New cat */
      char name[0x20];
      long age;
      int type;

      cout << "Species [0=Bengal Cat / 1=Ocicat / 2=Ocelot / 3=Savannah Cat]: ";
      cin >> type;
      cout << "Age: ";
      cin >> age;
      cout << "Name: ";
      cin >> name;

      switch (type) {
      case 0: cat = Bengal(age, name) ; break;
      case 1: cat = Ocicat(age, name) ; break;
      case 2: cat = Ocelot(age, name) ; break;
      case 3: cat = Savannah(age, name) ; break;
      default: cout << "Invalid species" << endl; break;
      }
      break;
    }

    case 2: { /* Get cat */
      cout << "Type: " << cat.index() << endl;
      visit([](auto& x) {
              cout << "Age : " << x.age << endl
                   << "Name: " << x.name << endl;
      }, cat);
      break;
    }

    case 3: { /* Set cat */
      char name[0x20];
      long age;

      cout << "Age: ";
      cin >> age;
      cout << "Name: ";
      cin >> name;

      visit([&](auto& x) {
              x.set(age, name);
      }, cat);
      break;
    }

    default:  /* Bye cat */
      cout << "Bye-nya!" << endl;
      return 0;
    }
  }

  return 1;
}
