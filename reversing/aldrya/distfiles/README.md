# ALDRYA - CakeCTF 2021

`server.py` is running on the remote server.
You can upload an ELF file and the server will execute the following command:

 $ ./aldrya <Your ELF> ./sample.aldrya

`sample.aldrya` is the signature of `sample.elf`.
You can test it like this:

 $ ./aldrya ./sample.elf ./sample.aldrya

The flag exists somewhere on the root directory.
