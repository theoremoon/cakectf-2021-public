use std::collections::HashMap;
use quicksilver::{
    geom::{Rectangle, Vector},
    graphics::{Color, VectorFont, FontRenderer, Image},
    run, Graphics, Input, Result, Settings, Window
};
use rand::Rng;

#[derive(PartialEq, Copy, Clone)]
enum Koma {
    Empty,
    WGyoku, WHisha, WKaku, WKin, WGin, WKei, WKyou, WFu,
    WRyu, WUma, WNgin, WNkei, WNkyou, WTo,
    BGyoku, BHisha, BKaku, BKin, BGin, BKei, BKyou, BFu,
    BRyu, BUma, BNgin, BNkei, BNkyou, BTo,
}
#[derive(PartialEq)]
enum State {
    Prepare, Computer, Player, ComputerWin, PlayerWin, AskPromote
}

const BOARD_X: f32 = 80.0;
const BOARD_Y: f32 = 140.0;
const KOMA_SIZE: f32 = 48.0;
const YOSHI_X: f32 = 520.0;
const YOSHI_Y: f32 = 16.0;

fn is_puttable(field: &Vec<Vec<Koma>>,
               x: usize, y: usize,
               koma: Koma) -> bool
{
    // TODO: check uchi-fu dsume
    field[y][x] == Koma::Empty && match koma {
        Koma::WKyou => y > 0,
        Koma::WKei => y > 1,
        Koma::WFu => y > 0 && (1..9).filter(
            |&i| field[i][x] == Koma::WFu
        ).count() == 0,
        _ => true
    }
}

fn is_promotable(fy: usize, ty: usize, koma: Koma) -> bool
{
    (fy < 3 && match koma {
        Koma::WFu | Koma::WKyou | Koma::WKei | Koma::WGin
            | Koma::WHisha | Koma::WKaku => true,
        _ => false
    }) || (ty < 3 && match koma {
        Koma::WFu | Koma::WKyou | Koma::WKei | Koma::WGin
            | Koma::WHisha | Koma::WKaku => true,
        _ => false
    })
}

fn must_promote(y: usize, koma: Koma) -> bool
{
    (y == 0 && koma == Koma::WFu)
        || (y == 0 && koma == Koma::WKyou)
        || (y < 2 && koma == Koma::WKei)
}

fn is_movable(field: &Vec<Vec<Koma>>,
              fx: usize, fy: usize,
              tx: usize, ty: usize)
              -> bool
{
    let dx = fx as i32 - tx as i32;
    let dy = fy as i32 - ty as i32;

    if dx == 0 && dy == 0 {
        false
    } else {
        match field[fy][fx] {
            Koma::WGyoku => (-2 < dx && dx < 2 && -2 < dy && dy < 2),
            Koma::WHisha =>
                (dx == 0 &&
                 if dy > 0 {1..dy} else {dy+1..0}.filter(
                     |&i| field[((fy as i32)-i) as usize][fx] != Koma::Empty
                 ).count() == 0)
                ||
                (dy == 0 &&
                 if dx > 0 {1..dx} else {dx+1..0}.filter(
                     |&i| field[fy][((fx as i32)-i) as usize] != Koma::Empty
                 ).count() == 0),
            Koma::WKaku =>
                (dx == dy &&
                 if dx > 0 {1..dx} else {dx+1..0}.filter(
                     |&i| field
                         [((fy as i32)-i) as usize]
                         [((fx as i32)-i) as usize] != Koma::Empty
                 ).count() == 0)
                ||
                (dx == -dy &&
                 if dx > 0 {1..dx} else {dx+1..0}.filter(
                     |&i| field
                         [((fy as i32)+i) as usize]
                         [((fx as i32)-i) as usize] != Koma::Empty
                 ).count() == 0),
            Koma::WKin | Koma::WNgin | Koma::WNkei | Koma::WNkyou | Koma::WTo
                => (dy == 1 && -2 < dx && dx < 2)
                || (dy == 0 && -2 < dx && dx < 2)
                || (dy == -1 && dx == 0),
            Koma::WGin => (dy == 1 && -2 < dx && dx < 2)
                || (dy == -1 && (dx == -1 || dx == 1)),
            Koma::WKei => (dx == -1 && dy == 2) || (dx == 1 && dy == 2),
            Koma::WKyou => dx == 0 && dy > 0
                && (1..dy).filter(
                    |&i| field[fy-i as usize][fx] != Koma::Empty
                ).count() == 0,
            Koma::WFu => (dx == 0 && dy == 1),
            Koma::WRyu => dx == 0 || dy == 0
                || (-2 < dx && dx < 2 && -2 < dy && dy < 2),
            Koma::WUma => dx == dy || dx == -dy
                || (-2 < dx && dx < 2 && -2 < dy && dy < 2),
            _ => false
        }
    }
}

fn koma_to_text(koma: Koma) -> &'static str
{
    match koma {
        Koma::WGyoku => "A", Koma::WHisha => "B",
        Koma::WKaku => "C", Koma::WKin => "D",
        Koma::WGin => "E", Koma::WKei => "F", Koma::WKyou => "G",
        Koma::WFu => "H", Koma::WRyu => "J", Koma::WUma => "K",
        Koma::WNgin => "L", Koma::WNkei => "M",
        Koma::WNkyou => "N", Koma::WTo => "O",
        Koma::BGyoku => "a", Koma::BHisha => "b",
        Koma::BKaku => "c", Koma::BKin => "d",
        Koma::BGin => "e", Koma::BKei => "f", Koma::BKyou => "g",
        Koma::BFu => "h", Koma::BRyu => "j", Koma::BUma => "k",
        Koma::BNgin => "l", Koma::BNkei => "m",
        Koma::BNkyou => "n", Koma::BTo => "o",
        _ => "",
    }
}

fn koma_to_symbol(koma: Koma) -> &'static str
{
    match koma {
        Koma::WGyoku => "K", Koma::WHisha => "R",
        Koma::WKaku => "B", Koma::WKin => "G",
        Koma::WGin => "S", Koma::WKei => "N", Koma::WKyou => "L",
        Koma::WFu => "P", Koma::WRyu => "%2bR",
        Koma::WUma => "%2bB",
        Koma::WNgin => "%2bs", Koma::WNkei => "%2bN",
        Koma::WNkyou => "%2bL", Koma::WTo => "%2bP",
        Koma::BGyoku => "k", Koma::BHisha => "r",
        Koma::BKaku => "b", Koma::BKin => "g",
        Koma::BGin => "s", Koma::BKei => "n", Koma::BKyou => "l",
        Koma::BFu => "p", Koma::BRyu => "%2br",
        Koma::BUma => "%2bb",
        Koma::BNgin => "%2bs", Koma::BNkei => "%2bn",
        Koma::BNkyou => "%2bl", Koma::BTo => "%2bp",
        _ => ""
    }
}

fn field_to_sfen(field: &Vec<Vec<Koma>>) -> String
{
    let mut sfen: String = String::from("");
    for i in 0..9 {
        let mut n = 0;
        for j in 0..9 {
            if field[i][j] == Koma::Empty {
                n += 1;
            } else {
                if n != 0 {
                    sfen += &n.to_string();
                    n = 0;
                }
                sfen += koma_to_symbol(field[i][j]);
            }
        }
        if n != 0 {
            sfen += &n.to_string();
        }
        if i != 8 {
            sfen += "/";
        }
    }
    return sfen;
}

fn komadai_to_sfen(komadai: &Vec<Koma>) -> String
{
    let mut sfen: String = String::from("");

    for koma in vec![
        Koma::WFu, Koma::WKyou, Koma::WKei, Koma::WGin, Koma::WKin,
        Koma::WHisha, Koma::WKaku,
        Koma::BFu, Koma::BKyou, Koma::BKei, Koma::BGin, Koma::BKin,
        Koma::BHisha, Koma::BKaku,
    ] {
        let n = komadai.iter().filter(|&k| *k == koma).count();
        if n == 1 {
            sfen += koma_to_symbol(koma);
        } else if n > 0 {
            sfen += &n.to_string();
            sfen += koma_to_symbol(koma);
        }
    }

    if sfen == "" {
        return String::from("-");
    } else {
        return sfen;
    }
}

fn init_board() -> Vec<Vec<Koma>>
{
    let mut field: Vec<Vec<Koma>> = Vec::new();
    for _ in 0..9 {
        let mut line: Vec<Koma> = Vec::new();
        for _ in 0..9 {
            line.push(Koma::Empty);
        }
        field.push(line);
    }
    field[0][0] = Koma::BKyou;
    field[0][8] = Koma::BKyou;
    field[0][1] = Koma::BKei;
    field[0][7] = Koma::BKei;
    field[0][2] = Koma::BGin;
    field[0][6] = Koma::BGin;
    field[0][3] = Koma::BKin;
    field[0][5] = Koma::BKin;
    field[0][4] = Koma::BGyoku;
    field[1][1] = Koma::BHisha;
    field[1][7] = Koma::BKaku;
    field[8][0] = Koma::WKyou;
    field[8][8] = Koma::WKyou;
    field[8][1] = Koma::WKei;
    field[8][7] = Koma::WKei;
    field[8][2] = Koma::WGin;
    field[8][6] = Koma::WGin;
    field[8][3] = Koma::WKin;
    field[8][5] = Koma::WKin;
    field[8][4] = Koma::WGyoku;
    field[7][1] = Koma::WKaku;
    field[7][7] = Koma::WHisha;

    for i in 0..9 {
        field[2][i] = Koma::BFu;
        field[6][i] = Koma::WFu;
    }

    return field;
}

fn draw_board(gfx: &mut Graphics,
              input: &Input,
              font: &mut FontRenderer,
              font_num: &mut FontRenderer,
              field: &Vec<Vec<Koma>>,
              komadai: &Vec<Koma>,
              koma_selected: bool,
              pos_selected: (usize, usize),
              komadai_id: &mut Koma,
              last_moved: (usize, usize))
{
    gfx.stroke_rect(
        &Rectangle::new(
            Vector::new(BOARD_X, BOARD_Y),
            Vector::new(440.0, 440.0)
        ),
        Color::BLACK
    );
    let mut color: Color;

    /* Banmen */
    for i in 0..9 {
        for j in 0..9 {
            gfx.stroke_rect(
                &Rectangle::new(
                    Vector::new(BOARD_X+4.0+(j as f32)*KOMA_SIZE,
                                BOARD_Y+4.0+(i as f32)*KOMA_SIZE),
                    Vector::new(KOMA_SIZE, KOMA_SIZE)
                ),
                Color::BLACK
            );
            if koma_selected && pos_selected == (j, i) {
                color = Color::RED;
            } else if last_moved == (j, i) {
                color = Color::BLUE;
            } else {
                color = Color::BLACK;
            }
            font.draw(
                gfx,
                koma_to_text(field[i][j]),
                color,
                Vector::new(BOARD_X+10.0+(j as f32)*KOMA_SIZE,
                            BOARD_Y+44.0+(i as f32)*KOMA_SIZE)
            ).unwrap();
        }
    }

    /* Komadai */
    let mut ofs = 0;
    let mut v = komadai.clone();
    for koma in vec![Koma::BFu, Koma::BKyou, Koma::BKei, Koma::BKin,
                     Koma::BGin, Koma::BHisha, Koma::BKaku] {
        if v.contains(&koma) {
            font.draw(
                gfx,
                koma_to_text(koma),
                Color::BLACK,
                Vector::new(BOARD_X-56.0,
                            BOARD_Y+(ofs as f32)*KOMA_SIZE)
            ).unwrap();
            font_num.draw(
                gfx,
                &v.iter().filter(|&x| *x == koma).count().to_string(),
                Color::BLACK,
                Vector::new(BOARD_X-20.0,
                            BOARD_Y+(ofs as f32)*KOMA_SIZE)
            ).unwrap();
            ofs += 1;
            while let Some(idx) = v.iter().position(|x| *x == koma) {
                v.remove(idx);
            }
        }
    }
    ofs = 0;
    for koma in vec![Koma::WFu, Koma::WKyou, Koma::WKei, Koma::WKin,
                     Koma::WGin, Koma::WHisha, Koma::WKaku] {
        if v.contains(&koma) {
            font.draw(
                gfx,
                koma_to_text(koma),
                if *komadai_id == koma {Color::RED} else {Color::BLACK},
                Vector::new(BOARD_X+456.0,
                            BOARD_Y+440.0-(ofs as f32)*KOMA_SIZE)
            ).unwrap();
            font_num.draw(
                gfx,
                &v.iter().filter(|&x| *x == koma).count().to_string(),
                Color::BLACK,
                Vector::new(BOARD_X+498.0,
                            BOARD_Y+440.0-(ofs as f32)*KOMA_SIZE)
            ).unwrap();

            let pos = input.mouse().location();
            if input.mouse().left()
                && pos.x >= BOARD_X+440.0 && pos.x <= BOARD_X+440.0+KOMA_SIZE
                && pos.y <= BOARD_Y+448.0-(ofs as f32)*KOMA_SIZE
                && pos.y >= BOARD_Y+448.0-((ofs+1) as f32)*KOMA_SIZE
            {
                *komadai_id = koma;
            }

            ofs += 1;
            while let Some(idx) = v.iter().position(|x| *x == koma) {
                v.remove(idx);
            }
        }
    }
}

fn koma_nari(koma: Koma) -> Koma {
    match koma {
        Koma::WHisha => Koma::WRyu, Koma::WKaku => Koma::WUma,
        Koma::WGin => Koma::WNgin, Koma::WKei => Koma::WNkei,
        Koma::WKyou => Koma::WNkyou, Koma::WFu => Koma::WTo,
        Koma::BHisha => Koma::BRyu, Koma::BKaku => Koma::BUma,
        Koma::BGin => Koma::BNgin, Koma::BKei => Koma::BNkei,
        Koma::BKyou => Koma::BNkyou, Koma::BFu => Koma::BTo,
        x => x
    }
}

fn koma_get(koma: Koma) -> Koma {
    match koma {
        Koma::WFu => Koma::BFu, Koma::WKyou => Koma::BKyou,
        Koma::WKei => Koma::BKei, Koma::WKin => Koma::BKin,
        Koma::WGin => Koma::BGin, Koma::WHisha => Koma::BHisha,
        Koma::WKaku => Koma::BKaku,
        Koma::WRyu => Koma::BHisha, Koma::WUma => Koma::BKaku,
        Koma::WNgin => Koma::BGin, Koma::WNkei => Koma::BKei,
        Koma::WNkyou => Koma::BKyou, Koma::WTo => Koma::BFu,
        Koma::BFu => Koma::WFu, Koma::BKyou => Koma::WKyou,
        Koma::BKei => Koma::WKei, Koma::BKin => Koma::WKin,
        Koma::BGin => Koma::WGin, Koma::BHisha => Koma::WHisha,
        Koma::BKaku => Koma::WKaku,
        Koma::BRyu => Koma::WHisha, Koma::BUma => Koma::WKaku,
        Koma::BNgin => Koma::WGin, Koma::BNkei => Koma::WKei,
        Koma::BNkyou => Koma::WKyou, Koma::BTo => Koma::WFu,
        x => x
    }
}

fn koma_move(field: &mut Vec<Vec<Koma>>,
             komadai: &mut Vec<Koma>,
             src_x: usize, src_y: usize, dst_x: usize, dst_y: usize,
             nari: bool)
{
    let tmp = if nari {
        koma_nari(field[src_y][src_x])
    } else {
        field[src_y][src_x]
    };
    if field[dst_y][dst_x] != Koma::Empty {
        komadai.push(koma_get(field[dst_y][dst_x]));
    }
    field[dst_y][dst_x] = tmp;
    field[src_y][src_x] = Koma::Empty;
}

fn koma_use(field: &mut Vec<Vec<Koma>>,
            komadai: &mut Vec<Koma>,
            x: usize, y: usize,
            koma_str: &str) {
    let koma = match koma_str {
        "L" => Koma::BKyou, "N" => Koma::BKei, "S" => Koma::BGin,
        "G" => Koma::BKin, "R" => Koma::BHisha, "B" => Koma::BKaku,
        "P" => Koma::BFu, _ => Koma::Empty
    };
    let i = komadai.iter().position(|x| *x == koma).unwrap();
    komadai.remove(i);

    // assert field[x][y] == Koma::Empty
    field[y][x] = koma;
}

fn is_koma_player(koma: Koma) -> bool
{
    match koma {
        Koma::WGyoku | Koma::WHisha | Koma::WKaku | Koma::WKin
            | Koma::WGin | Koma::WKei | Koma::WKyou | Koma::WFu
            | Koma::WRyu | Koma::WUma | Koma::WNgin | Koma::WNkei
            | Koma::WNkyou | Koma::WTo => true,
        _ => false
    }
}

fn enemy_move(field: &mut Vec<Vec<Koma>>,
              komadai: &mut Vec<Koma>,
              last_moved: &mut (usize, usize),
              state: &mut State,
              key: &mut Vec<u8>)
{
    let resp = reqwest::blocking::get(format!(
        "http://yoshi-shogi.cakectf.com:15061/ponder?position={}&hand={}&move=w",
        field_to_sfen(field),
        komadai_to_sfen(komadai)
    ))
        .unwrap_or_else(|err| panic!("Server Error => {}", err))
        .json::<HashMap<String, String>>()
        .unwrap_or_else(|err| panic!("JSON Error => {}", err));

    if resp["bestmove"] == "win" {
        *state = State::ComputerWin;
        return;
    } else if resp["bestmove"] == "resign" {
        *state = State::PlayerWin;
        *key = vec![119, 105, 110];
        return;
    }

    if &resp["bestmove"][1..2] == "*" {
        /* Use */
        let x = 8 - (resp["bestmove"].chars().nth(2).unwrap() as i32 - 0x31);
        let y = resp["bestmove"].chars().nth(3).unwrap() as i32 - 0x61;
        koma_use(
            field, komadai,
            x as usize, y as usize,
            &resp["bestmove"][0..1]
        );
        *last_moved = (x as usize, y as usize);
    } else {
        let src_x = 8-(resp["bestmove"].chars().nth(0).unwrap() as i32 - 0x31);
        let src_y = resp["bestmove"].chars().nth(1).unwrap() as i32 - 0x61;
        let dst_x = 8-(resp["bestmove"].chars().nth(2).unwrap() as i32 - 0x31);
        let dst_y = resp["bestmove"].chars().nth(3).unwrap() as i32 - 0x61;
        let nari = resp["bestmove"].chars().nth(4).unwrap_or(0 as char);
        koma_move(
            field, komadai,
            src_x as usize, src_y as usize,
            dst_x as usize, dst_y as usize,
            nari == '+'
        );
        *last_moved = (dst_x as usize, dst_y as usize);
    }
    *state = State::Player;
}

fn mouse_on_board(pos: &Vector) -> Option<(usize, usize), >
{
    if pos.x < BOARD_X || pos.x > BOARD_X+440.0
        || pos.y < BOARD_Y || pos.y > BOARD_Y+440.0
    {
        None
    } else {
        Some((
            std::cmp::min(((pos.x-BOARD_X)/KOMA_SIZE) as usize, 8),
            std::cmp::min(((pos.y-BOARD_Y)/KOMA_SIZE) as usize, 8)
        ))
    }
}

fn draw_king(gfx: &mut Graphics,
             font: &mut FontRenderer,
             img_king: &Image,
             img_dialog: &Image,
             state: &State)
{
    gfx.draw_image(&img_king, Rectangle::new(
        Vector::new(YOSHI_X, YOSHI_Y), img_king.size()
    ));
    gfx.draw_image(&img_dialog, Rectangle::new(
        Vector::new(YOSHI_X - 360.0, YOSHI_Y), img_dialog.size()
    ));
    let msg = match state {
        State::Prepare => "Yo! Click me to start!\nRight click for flag mode!",
        State::Computer => "It's my turn.\nHmmmm...",
        State::Player => "It's your turn.",
        State::ComputerWin => "You lost, noob!",
        State::PlayerWin => "You win.\nUnbelievable...",
        State::AskPromote => "Promote?",
    };
    font.draw(gfx, msg, Color::BLACK, Vector::new(188.0, 60.0)).unwrap();

    if *state == State::AskPromote {
        gfx.stroke_rect(
            &Rectangle::new(
                Vector::new(YOSHI_X - 260.0, YOSHI_Y+60.0),
                Vector::new(100.0, 32.0)
            ),
            Color::BLACK
        );
        gfx.stroke_rect(
            &Rectangle::new(
                Vector::new(YOSHI_X - 140.0, YOSHI_Y+60.0),
                Vector::new(100.0, 32.0)
            ),
            Color::BLACK
        );
        font.draw(gfx, "Yes", Color::BLACK,
                  Vector::new(YOSHI_X - 238.0, YOSHI_Y+86.0)).unwrap();
        font.draw(gfx, "No", Color::BLACK,
                  Vector::new(YOSHI_X - 108.0, YOSHI_Y+86.0)).unwrap();
    }
}

/**
 * Game
 */
async fn app(window: Window, mut gfx: Graphics, mut input: Input)
             -> Result<()>
{
    let ttf_koma = VectorFont::load("KsShogiPieces.ttf").await?;
    let ttf_text = VectorFont::load("IndieFlower-Regular.ttf").await?;
    let mut font_koma = ttf_koma.to_renderer(&gfx, 44.0)?;
    let mut font_text = ttf_text.to_renderer(&gfx, 44.0)?;
    let mut font_num = ttf_text.to_renderer(&gfx, 32.0)?;

    let img_king = Image::load(&gfx, "yoshiking.png").await?;
    let img_dialog = Image::load(&gfx, "dialogue.png").await?;

    let mut field: Vec<Vec<Koma>> = init_board();
    let mut komadai: Vec<Koma> = Vec::new();

    let mut state = State::Prepare;
    let mut last_moved: (usize, usize) = (10, 10);
    let mut koma_selected = false;
    let mut pos_selected: (usize, usize) = (0, 0);
    let mut komadai_id = Koma::Empty;
    let mut flag_mode = false;
    let mut key: Vec<u8> = vec![121, 18, 175, 144, 32, 163, 57, 145, 26, 44, 166, 73, 169, 136, 157, 196, 31, 98, 40, 4, 131, 208, 143, 149, 122, 55, 57, 72, 192, 128, 106, 49, 174, 166, 69, 116, 101, 190, 211, 201, 88, 90, 5, 214, 156, 63, 241, 82, 209, 44];
    let delta: Vec<u8> = vec![82, 80, 71, 127, 148, 13, 97, 146, 54, 90, 129, 35, 92, 209, 123, 135, 18, 4, 232, 117, 26, 237, 2, 228, 253, 58, 232, 241, 38, 63, 103, 59, 185, 225, 92, 207, 28, 71, 239, 243, 68, 230, 78, 141, 146, 165, 107, 45, 202, 2];

    loop {
        while let Some(_) = input.next_event().await {}

        /* Mouse event */
        let mouse = input.mouse();
        if mouse.right() {
            let pos = mouse.location();
            /* Flag mode */
            if state == State::Prepare
                && pos.x >= YOSHI_X && pos.x <= YOSHI_X + 128.0
                && pos.y >= YOSHI_Y && pos.y <= YOSHI_Y + 128.0
            {
                flag_mode = true;
                for i in 0..9 {
                    field[2][i] = Koma::BTo;
                }
                field[1][1] = Koma::BRyu;
                field[1][7] = Koma::BUma;
                state = if rand::thread_rng().gen::<bool>() {
                    State::Player
                } else {
                    State::Computer
                };
            }
        }

        if mouse.left() {
            let pos = mouse.location();
            /* Game start */
            if state == State::Prepare
                && pos.x >= YOSHI_X && pos.x <= YOSHI_X + 128.0
                && pos.y >= YOSHI_Y && pos.y <= YOSHI_Y + 128.0
            {
                state = if rand::thread_rng().gen::<bool>() {
                    State::Player
                } else {
                    State::Computer
                };
            }

            /* Resign */
            if state == State::Player
                && pos.x >= BOARD_X+470.0 && pos.x <= BOARD_X+570.0
                && pos.y >= BOARD_Y+48.0 && pos.y <= BOARD_Y+88.0
            {
                state = State::ComputerWin;
            }

            /* Promote */
            if state == State::AskPromote
                && pos.y >= YOSHI_Y+60.0 && pos.y <= YOSHI_Y+92.0
            {
                let (x, y) = last_moved;
                if pos.x >= YOSHI_X - 260.0 && pos.x <= YOSHI_X - 160.0 {
                    // yes
                    field[y][x] = koma_nari(field[y][x]);
                    state = State::Computer;
                } else if pos.x >= YOSHI_X - 140.0 && pos.x <= YOSHI_X - 40.0 {
                    // no
                    state = State::Computer;
                }
            }

            /* Move koma */
            if state == State::Player {
                if let Some((x, y)) = mouse_on_board(&pos) {
                    if koma_selected && (x, y) != pos_selected {
                        if !is_koma_player(field[y][x])
                            && is_movable(&field,
                                          pos_selected.0, pos_selected.1, x, y)
                        {
                            let tmp = field[y][x];
                            field[y][x] = field[pos_selected.1][pos_selected.0];
                            field[pos_selected.1][pos_selected.0] = Koma::Empty;
                            if tmp != Koma::Empty {
                                komadai.push(koma_get(tmp));
                            }
                            if must_promote(y, field[y][x]) {
                                field[y][x] = koma_nari(field[y][x]);
                                state = State::Computer;
                            } else if is_promotable(pos_selected.1, y,
                                                    field[y][x]) {
                                state = State::AskPromote;
                            } else {
                                state = State::Computer;
                            }
                            last_moved = (x, y);
                        }
                        koma_selected = false;
                    } else if komadai_id != Koma::Empty
                        && is_puttable(&field, x, y, komadai_id)
                    {
                        field[y][x] = komadai_id;
                        komadai.remove(
                            komadai.iter()
                                .position(|&x| x == komadai_id)
                                .unwrap()
                        );
                        komadai_id = Koma::Empty;
                        last_moved = (x, y);
                        state = State::Computer;
                    } else if is_koma_player(field[y][x]) {
                        koma_selected = true;
                        komadai_id = Koma::Empty;
                        pos_selected = (x, y);
                    }
                } else {
                    koma_selected = false;
                    komadai_id = Koma::Empty;
                }
            }
        }

        /* Draw */
        gfx.clear(Color::from_rgba(230, 230, 230, 1.0));
        draw_board(&mut gfx, &input, &mut font_koma, &mut font_num,
                   &field, &komadai,
                   koma_selected, pos_selected,
                   &mut komadai_id,
                   last_moved);
        draw_king(&mut gfx, &mut font_text, &img_king, &img_dialog,
                  &state);
        if state == State::Player {
            gfx.stroke_rect(
                &Rectangle::new(
                    Vector::new(BOARD_X+470.0, BOARD_Y+48.0),
                    Vector::new(100.0, 40.0)
                ),
                Color::BLACK
            );
            font_text.draw(&mut gfx, "Resign", Color::BLACK,
                           Vector::new(BOARD_X+478.0, BOARD_Y+72.0)).unwrap();
        }
        /* Flag */
        if state == State::PlayerWin && flag_mode {
            let mut flag: String = "".to_string();
            let (mut a0, mut a1) = (7, 23);
            for i in 0..delta.len() {
                let c = (((delta[i] ^ key[i % key.len()]) as u32) + a0 + a1) % 0x100;
                flag = format!(
                    "{}{}",
                    &flag,
                    std::char::from_u32(c).unwrap_or('?').to_string()
                );
                a0 = a1;
                a1 = c ^ (delta[i] as u32);
            }
            font_text.draw(&mut gfx, &flag, Color::RED,
                           Vector::new(32.0, 320.0)).unwrap();
        }
        gfx.present(&window)?;

        /* Computer Turn */
        if state == State::Computer {
            enemy_move(&mut field, &mut komadai, &mut last_moved, &mut state,
                       &mut key);
        }
        if komadai_id != Koma::Empty && koma_selected {
            koma_selected = false;
        }
    }
}

fn main()
{
    run(
        Settings {
            title: "yoshi-shogi",
            size: Vector { x: 700.0, y:620.0 },
            resizable: false,
            ..Settings::default()
        },
        app,
    );
}
