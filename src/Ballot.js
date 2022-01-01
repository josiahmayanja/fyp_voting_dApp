import React from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';


const Ballot = () => {

    return (
        <div className="Ballot_Table" >
        <Table striped bordered hover  style={{width: 100}}>
            <thead>
                <tr>
                <th>#</th>
                <th>Canidate</th>
                <th>Vote Tally</th>
                </tr>
            </thead>
            <tbody>

              {/* line split */}
                <tr>
                <td>1</td>
                <td>A</td>
                <td>0</td>
                </tr>


            {/* line split */}
                <tr>
                <td>2</td>
                <td>B</td>
                <td>0</td>

                </tr>
            </tbody>
        </Table>
        </div>

    );
}


export default Ballot;