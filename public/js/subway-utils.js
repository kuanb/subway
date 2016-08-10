function is_in_array(value, array) {
  return array.indexOf(value) > -1;
}

function is_in_2d_array(arr, i, j) {
    for (var a = 0; a < arr.length; a++) {
        var p = arr[a];
        if (p.indexOf(i) > -1 && p.indexOf(j) > -1) {
            return true;
        }
    }
    return false;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

function sort_by_group(line_ids) {
    // Takes an array of line IDs, and sorts based on the group they're in.
    // e.g. [B,C] -> [B,C], [A,B,C,D] -> [A,C,B,D]

    return line_ids.sort(function(x,y) {
        var group_x = lines_to_groups([x])[0];
        var group_y = lines_to_groups([y])[0];
        if (group_x == group_y) {
            return N_line_groups[group_x].lines.indexOf(x) > N_line_groups[group_y].lines.indexOf(y);
        } else {
            return group_x > group_y;
        }
    });
}

function debug_stations(station_id_list) {
    for (var i = 0; i < station_id_list.length; i++) {
        console.log(N_stations[station_id_list[i]]);
    }
}

function debug_lines(line_id_list) {
    for (var i = 0; i < line_id_list.length; i++) {
        console.log(N_lines[line_id_list[i]]);
    }
}

function find_stations_by_name(station_name) {
    var stations = [];
    for (var i = 0; i < N_stations.length; i++) {
        if (N_stations[i].name == station_name && N_stations[i].active) {
            stations.push(N_stations[i]);
        }
    }
    return stations;
}

function debug_voxels() {

    for (var lat = LAT_MIN; lat < LAT_MAX; lat += VOXELS_RES_LAT) {
        for (var lng = LNG_MIN; lng < LNG_MAX; lng += VOXELS_RES_LNG) {
            var voxel_i = Math.round((lat - LAT_MIN)/VOXELS_RES_LAT);
            var voxel_j = Math.round((lng - LNG_MIN)/VOXELS_RES_LNG);

            console.log("Adding voxel at "+voxel_i.toString()+","+voxel_j.toString());
            var voxel = L.rectangle([[lat, lng], [lat+VOXELS_RES_LAT, lng+VOXELS_RES_LNG]], {color: "#ff7800", weight: 0, fillOpacity: demand[voxel_i][voxel_j]/1000.0});
            voxel.addTo(map);

        }
    }
}

function debug_control_points(c) {
    for (var i = 0; i < c.length; i++) {
        console.log("Set: ("+c[i][0][0]+","+c[i][0][1]+"), ("+c[i][1][0]+","+c[i][1][1]+")");
    }
}

function redraw_all_lines() {
    for (var i = 0; i < N_lines.length; i++) {
        N_lines[i].draw();
    }

    station_layer.bringToFront();
}

function average_control_points(cpta) {

    // Takes in a 3d array of pairs of control points (each control point being an x,y pair)
    var num_sets = cpta.length;
    var cp_average = [[0.0,0.0],[0.0,0.0]];
    for (var i = 0; i < num_sets; i++) {
        for (var j = 0; j < 2; j++) {
            for (var k = 0; k < 2; k++) {
                cp_average[j][k] += (cpta[i][j][k] * 1.0) / (num_sets * 1.0);
            }
        }
    }
    return cp_average;

}

function number_of_active_stations() {
    var n = 0;
    for (var i = 0; i < N_stations.length; i++) {
        if (N_stations[i].active) {
            n += 1;
        }
    }
    return n;
}

function clear_debug_layer() {

    map.removeLayer(debug_layer);
    debug_layer = L.featureGroup();
    map.addLayer(debug_layer);
}