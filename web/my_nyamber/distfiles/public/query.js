let header_list = ['nid', 'species', 'name', 'age'];

/**
 * Create a table with the query result
 */
function build_table(info_list)
{
    /* Remove the existing table */
    let result = document.getElementById('result');
    let table = document.getElementById('table');
    if (table) result.removeChild(table);

    /* Create a new table */
    table = document.createElement('table');
    table.id = 'table';
    let table_body = document.createElement('tbody');

    /* Add header */
    let header = document.createElement('tr');
    for (let key of header_list) {
        let cell = document.createElement('th');
        let cell_text = document.createTextNode(key);
        cell.appendChild(cell_text);
        header.appendChild(cell);
    }
    table_body.appendChild(header);

    /* Add contents */
    for (let info of info_list) {
        let row = document.createElement('tr');

        for (let key of header_list) {
            let cell = document.createElement('td');
            if (key == 'nid')
                var cell_text = document.createTextNode('********');
            else
                var cell_text = document.createTextNode(info[key]);
            cell.appendChild(cell_text);
            row.appendChild(cell);
        }

        table_body.appendChild(row);
    }

    table.appendChild(table_body);
    table.setAttribute("border", "2");
    result.appendChild(table);
}

/**
 * Query personyal information
 */
function query()
{
    let nid  = document.getElementById('nid').value;
    let name = document.getElementById('name').value;

    /* Setup query */
    if (nid)
        var param = "id=" + encodeURIComponent(nid);
    else if (name)
        var param = "name=" + encodeURIComponent(name);

    /* Send API request */
    let request = new XMLHttpRequest();
    request.open('GET', '/api/neko?' + param);
    request.responseType = 'json';
    request.onload = () => {
        if (request.response.result.length == 0)
            alert("Please confirm your information and try again.");
        else
            build_table(request.response.result);
    }
    request.send();
}
