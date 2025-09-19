import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class OpenStackSwift implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'OpenStack Swift',
    name: 'openStackSwift',
    icon: 'file:swift.svg',
    group: ['output'],
    version: 1,
    subtitle: 'Interact with OpenStack Swift',
    description: 'Perform operations on OpenStack Swift storage',
    defaults: {
      name: 'OpenStack Swift',
    },
    inputs: ['main'] as NodeConnectionType[],
    outputs: ['main'] as NodeConnectionType[],
    credentials: [
      {
        name: 'openStackSwiftApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'List Containers',
            value: 'listContainers',
            description: 'List all containers in Swift storage',
            action: 'List all containers in swift storage',
          },
          {
            name: 'Create Container',
            value: 'createContainer',
            description: 'Create a new container in Swift storage',
            action: 'Create a new container in swift storage',
          },
        ],
        default: 'listContainers',
      },
      {
        displayName: 'Container Name',
        name: 'containerName',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['createContainer'],
          },
        },
        description: 'Name of the container to create',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('openStackSwiftApi');
    const token = credentials.authToken as string;
    const storageUrl = credentials.storageUrl as string;

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      if (operation === 'listContainers') {
        const url = `${storageUrl}`;

        const response = await this.helpers.httpRequest({
          method: 'GET',
          url,
          headers: { 'X-Auth-Token': token },
          ignoreHttpStatusErrors: false,
        });

        if (Array.isArray(response)) {
          returnData.push({
            json: { containers: response },
            pairedItem: { item: i },
          });
        } else {
          returnData.push({
            json: { data: response },
            pairedItem: { item: i },
          });
        }
      } else if (operation === 'createContainer') {
        const containerName = this.getNodeParameter('containerName', i) as string;
        if (!containerName) {
          throw new NodeOperationError(this.getNode(), 'Container name is required', { itemIndex: i });
        }
        const url = `${storageUrl}/${containerName}`;
        const response = await this.helpers.httpRequest({
          method: 'PUT',
          url,
          headers: { 'X-Auth-Token': token },
          ignoreHttpStatusErrors: false,
        });
        returnData.push({
          json: { success: true, container: containerName, response },
          pairedItem: { item: i },
        });
      }
    }
    return [returnData];
  }
}
