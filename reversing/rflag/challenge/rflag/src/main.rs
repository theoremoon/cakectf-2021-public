extern crate rand;
use std::io;
use std::io::Write;
use rand::{thread_rng, Rng};
use rand::distributions::Uniform;
use regex::Regex;
use std::fs::File;
use std::io::prelude::*;

#[inline(never)]
fn guessy(answer: &String, r: &str) -> Vec<usize> {
    if r.is_empty() {
        vec![]
    } else {
        let re = Regex::new(r).unwrap_or(
            Regex::new("neko").unwrap()
        );
        re.find_iter(answer).map(
            |m| m.start()
        ).collect()
    }
}

#[inline(never)]
fn rflag(debug: bool) {
    let answer: String = (&mut thread_rng())
        .sample_iter(Uniform::new(0u8, 16u8))
        .take(32)
        .map(|v| format!("{:x}", v))
        .collect();
    println!("You have 4 rounds to guess the 32-byte hex string!");
    println!("Give me your guess and I'll tell you the positions");
    println!("of all the matches.");
    if debug {
        println!("[DEBUG] Piece of Cake Mode is enabled (Not on remote :P)");
        println!("[DEBUG] {}", answer);
    }
    for round in 0..4 {
        let mut r = String::new();
        print!("Round {}/4: ", round+1);
        io::stdout().flush().unwrap();
        io::stdin().read_line(&mut r)
            .expect("I/O error");
        let v = guessy(&answer, &r.trim());
        println!("Response: {:?}", v);
    }

    let mut r = String::new();
    println!("Okay, what's the answer?");
    io::stdin().read_line(&mut r)
        .expect("I/O error");
    if r.trim() == answer {
        println!("Correct!");
        let mut f = File::open("flag.txt")
            .expect("`flag.txt` not found");
        let mut flag = String::new();
        f.read_to_string(&mut flag)
            .expect("Cannot read `flag.txt`");
        println!("FLAG: {}", flag);
    } else {
        println!("Wrong...");
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    rflag(args.len() >= 2 && args[1] == "cakemode");
}
